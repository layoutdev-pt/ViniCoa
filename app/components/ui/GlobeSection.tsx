import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { geoCircle, geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";

const topo = world as unknown as Topology<{ countries: GeometryCollection; land: GeometryCollection }>;
const LAND = feature(topo, topo.objects.land);
const BORDERS = mesh(topo, topo.objects.countries, (a, b) => a !== b);
const GRATICULE = geoGraticule10();

const ORIGIN: [number, number] = [-7.09, 40.35]; // Sabugal

// Ondas que partem do Sabugal e se espalham pelo globo (sem destinos concretos)
const WAVES = 4;
const WAVE_PERIOD = 7000; // ms que cada onda leva a atravessar o globo
const WAVE_MAX = 85; // raio máximo em graus

function waves(t: number) {
  return Array.from({ length: WAVES }, (_, i) => {
    const phase = (t / WAVE_PERIOD + i / WAVES) % 1;
    const eased = 1 - Math.pow(1 - phase, 2);
    return {
      d: geoCircle().center(ORIGIN).radius(1 + eased * WAVE_MAX).precision(2)(),
      opacity: Math.round((1 - phase) * 0.8 * 100) / 100,
    };
  });
}

const SIZE = 500;
const RADIUS = 228;
const TILT = -28;

// Oscila entre o Atlântico e a Europa para o Sabugal ficar sempre à vista
const centerLon = (t: number) => -18 + 30 * Math.sin(t * 0.00018);

function makeProjection(lon: number) {
  return geoOrthographic()
    .scale(RADIUS)
    .translate([SIZE / 2, SIZE / 2])
    .clipAngle(90)
    .rotate([-lon, TILT]);
}

function frame(lon: number, t: number) {
  const projection = makeProjection(lon);
  const path = geoPath(projection);
  const center: [number, number] = [lon, -TILT];
  return {
    graticule: path(GRATICULE) ?? "",
    land: path(LAND) ?? "",
    borders: path(BORDERS) ?? "",
    waves: waves(t).map((w) => ({ d: path(w.d) ?? "", opacity: w.opacity })),
    // Arredondado para o HTML do servidor e do browser coincidirem (hydration)
    origin: {
      xy: (projection(ORIGIN) ?? [0, 0]).map((v) => Math.round(v * 100) / 100) as [number, number],
      visible: geoDistance(ORIGIN, center) < Math.PI / 2 - 0.05,
    },
  };
}

export function GlobeSection() {
  const gradientId = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [revealed, setRevealed] = useState(false);

  const initial = useMemo(() => frame(centerLon(0), 0), []);

  // Entrada suave do texto quando a secção aparece
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setRevealed(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Rotação do globo: escreve diretamente no SVG (sem re-render do React) e pausa fora do ecrã
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const q = <T extends Element>(sel: string) => Array.from(svg.querySelectorAll<T>(sel));
    const graticule = svg.querySelector<SVGPathElement>("[data-g='graticule']");
    const land = svg.querySelector<SVGPathElement>("[data-g='land']");
    const borders = svg.querySelector<SVGPathElement>("[data-g='borders']");
    const waveEls = q<SVGPathElement>("[data-g='wave']");
    const origin = svg.querySelector<SVGGElement>("[data-g='origin']");

    let raf = 0;
    let running = false;
    const start = performance.now();

    const tick = (now: number) => {
      const f = frame(centerLon(now - start), now - start);
      graticule?.setAttribute("d", f.graticule);
      land?.setAttribute("d", f.land);
      borders?.setAttribute("d", f.borders);
      waveEls.forEach((el, i) => {
        el.setAttribute("d", f.waves[i].d);
        el.style.opacity = String(f.waves[i].opacity);
      });
      if (origin) {
        origin.setAttribute("transform", `translate(${f.origin.xy[0]} ${f.origin.xy[1]})`);
        origin.style.opacity = f.origin.visible ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const reveal = (delay: string) =>
    `transition-all duration-1000 ease-out ${delay} ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0D0B0C] px-6 lg:px-12 py-20 lg:py-28">
      {/* Luz bordô por trás do globo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-bordo/25 blur-[110px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className={`text-center max-w-2xl mx-auto mb-8 lg:mb-4 ${reveal("")}`}>
          <span className="font-downey text-xs uppercase tracking-[0.35em] text-dourado block mb-4">Envios internacionais</span>
          <h2 className="font-brand uppercase text-4xl sm:text-5xl lg:text-6xl text-[#F8F4EB] tracking-[0.06em] mb-6">
            Do Sabugal para o mundo
          </h2>
          <p className="text-base sm:text-lg text-[#E8DCC6]/80 leading-relaxed">
            Não temos balcão, temos destino: cada garrafa parte do Sabugal diretamente para a sua mesa, esteja onde estiver.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,540px)_1fr] items-center gap-6 lg:gap-10">
          <div className={`order-2 lg:order-1 text-center lg:text-right ${reveal("delay-500")}`}>
            <h3 className="font-brand uppercase text-2xl text-[#F8F4EB] tracking-[0.08em] mb-4">Portugal</h3>
            <span className="block w-12 h-px bg-dourado/70 mx-auto lg:mr-0 lg:ml-auto mb-5" aria-hidden="true" />
            <p className="text-base text-[#E8DCC6]/80 leading-relaxed max-w-xs mx-auto lg:mr-0 lg:ml-auto">
              Entregamos em todo o país, em embalagens de proteção pensadas para que cada garrafa chegue intacta.
            </p>
          </div>

          <div className="order-1 lg:order-2 w-full max-w-[540px] mx-auto">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full h-auto"
              role="img"
              aria-label="Globo com ondas a partir do Sabugal"
            >
              <defs>
                <radialGradient id={gradientId} cx="38%" cy="32%" r="75%">
                  <stop offset="0%" stopColor="#2A2124" />
                  <stop offset="100%" stopColor="#0D0B0C" />
                </radialGradient>
              </defs>

              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill={`url(#${gradientId})`}
                stroke="#C49A4A"
                strokeOpacity={0.3}
                strokeWidth={0.8}
              />
              <path data-g="graticule" d={initial.graticule} fill="none" stroke="#E8DCC6" strokeOpacity={0.06} strokeWidth={0.5} />
              <path data-g="land" d={initial.land} fill="#E8DCC6" fillOpacity={0.1} stroke="#E8DCC6" strokeOpacity={0.4} strokeWidth={0.6} />
              <path data-g="borders" d={initial.borders} fill="none" stroke="#E8DCC6" strokeOpacity={0.14} strokeWidth={0.4} />

              {initial.waves.map((w, i) => (
                <path
                  key={i}
                  data-g="wave"
                  d={w.d}
                  fill="none"
                  stroke="#C49A4A"
                  strokeWidth={1.2}
                  style={{ opacity: w.opacity }}
                />
              ))}

              <g
                data-g="origin"
                transform={`translate(${initial.origin.xy[0]} ${initial.origin.xy[1]})`}
                style={{ opacity: initial.origin.visible ? 1 : 0, transition: "opacity 0.4s" }}
              >
                <circle r={9} fill="#C49A4A" opacity={0.25} />
                <circle r={4.5} fill="#C49A4A" />
              </g>
            </svg>
          </div>

          <div className={`order-3 text-center lg:text-left ${reveal("delay-500")}`}>
            <h3 className="font-brand uppercase text-2xl text-[#F8F4EB] tracking-[0.08em] mb-4">Além-fronteiras</h3>
            <span className="block w-12 h-px bg-dourado/70 mx-auto lg:ml-0 lg:mr-auto mb-5" aria-hidden="true" />
            <p className="text-base text-[#E8DCC6]/80 leading-relaxed max-w-xs mx-auto lg:ml-0 lg:mr-auto">
              Enviamos também para o estrangeiro, para que os nossos vinhos cheguem a qualquer mesa do mundo.
            </p>
          </div>
        </div>

        <div className={`mt-12 lg:mt-14 text-center ${reveal("delay-700")}`}>
          <Link to="/vinhos" className="btn-brand btn-bordo">
            Comprar online <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GlobeSection;

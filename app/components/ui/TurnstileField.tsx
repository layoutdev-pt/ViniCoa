import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        "expired-callback": () => void;
        "error-callback": () => void;
        theme?: "light" | "dark" | "auto";
      }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type Props = { onToken: (token: string) => void; resetKey?: number };

const PLACEHOLDER_VALUE = /<[^>]*>|placeholder|chave_de_turnstile|change[_ -]?me|your[_ -]?(site|secret)/i;
const rawSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
const SITE_KEY = rawSiteKey?.trim() && !PLACEHOLDER_VALUE.test(rawSiteKey) ? rawSiteKey.trim() : undefined;
const SCRIPT_ID = "cloudflare-turnstile-script";

export const isTurnstileConfigured = Boolean(SITE_KEY);

export function TurnstileField({ onToken, resetKey = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    const render = () => {
      if (cancelled || !window.turnstile || !containerRef.current || widgetId) return;
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "dark",
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current(""),
      });
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", render);
    render();

    return () => {
      cancelled = true;
      script?.removeEventListener("load", render);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [resetKey]);

  if (!SITE_KEY) {
    if (import.meta.env.DEV) return null;
    return (
      <p role="status" className="text-sm text-red-300">
        A verificação anti-spam ainda não está configurada. Tenta novamente mais tarde.
      </p>
    );
  }
  return <div ref={containerRef} aria-label="Verificação anti-spam" />;
}

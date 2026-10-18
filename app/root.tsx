import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "react-router";
import "./app.css";
import { CartProvider } from "./lib/cart-context";
import { AdminProvider } from "./lib/admin-context";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AgeGateModal } from "./components/ui/AgeGateModal";
import { CookieBanner } from "./components/ui/CookieBanner";
import { WhatsAppWidget } from "./components/ui/WhatsAppWidget";
import { SearchModal } from "./components/ui/SearchModal";
import { QuickViewModal } from "./components/ui/QuickViewModal";
import { CartDrawer } from "./components/ui/CartDrawer";
import { Toast } from "./components/ui/Toast";
import { SecurePurchaseSection } from "./components/ui/SecurePurchaseSection";
import { REVEAL_BOOT_SCRIPT, useReveal } from "./lib/use-reveal";

export function meta() {
  return [
    { title: "Vinicôa — Garrafeira Online do Sabugal" },
    {
      name: "description",
      content:
        "Vinicôa — Garrafeira online com raízes no Sabugal. Vinhos selecionados de vários produtores e regiões, com envio para todo o mundo.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function App() {
  useReveal();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    // suppressHydrationWarning: o script de arranque acrescenta "reveal-on" antes da hidratação
    <html lang="pt" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT_SCRIPT }} />
        <Meta />
        <Links />
        {/* Fontes da marca: Berlin Sans e Downey são locais (app.css); Lato para texto corrido */}
        <link rel="preload" href="/fonts/berlinsans.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative antialiased selection:bg-bordo selection:text-dourado min-h-screen flex flex-col justify-between">
        <CartProvider>
          <AdminProvider>
            {!isAdmin && <AgeGateModal />}
            {!isAdmin && <CookieBanner />}
            {!isAdmin && <WhatsAppWidget />}
            {!isAdmin && <SearchModal />}
            {!isAdmin && <QuickViewModal />}
            {!isAdmin && <CartDrawer />}
            <Toast />

            {!isAdmin && <Navbar />}
            <main className="flex-1 w-full">
              <Outlet />
            </main>
            {!isAdmin && <SecurePurchaseSection />}
            {!isAdmin && <Footer />}
          </AdminProvider>
        </CartProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
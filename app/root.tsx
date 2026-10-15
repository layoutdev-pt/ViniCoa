import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";
import { CartProvider } from "./lib/cart-context";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AgeGateModal } from "./components/ui/AgeGateModal";
import { CookieBanner } from "./components/ui/CookieBanner";
import { WhatsAppWidget } from "./components/ui/WhatsAppWidget";
import { SearchModal } from "./components/ui/SearchModal";
import { QuickViewModal } from "./components/ui/QuickViewModal";
import { CartDrawer } from "./components/ui/CartDrawer";
import { Toast } from "./components/ui/Toast";

export function meta() {
  return [
    { title: "Vinicôa — Vinhos de Tradição e Solo do Sabugal" },
    {
      name: "description",
      content:
        "Vinicôa — Vinhos de altitude e tradição cultivados nos solos graníticos da Beira Interior, Sabugal. Descubra a nossa garrafeira exclusiva, terroir e história.",
    },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
}

export default function App() {
  return (
    <html lang="pt" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        {/* Google Fonts Premium */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative antialiased selection:bg-bordo selection:text-dourado min-h-screen flex flex-col justify-between">
        <CartProvider>
          <AgeGateModal />
          <CookieBanner />
          <WhatsAppWidget />
          <SearchModal />
          <QuickViewModal />
          <CartDrawer />
          <Toast />

          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </CartProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
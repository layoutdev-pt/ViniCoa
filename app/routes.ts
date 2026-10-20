import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("vinhos", "pages/shop.tsx"),
  route("vinhos/:id", "pages/wine-detail.tsx"),
  route("loja", "pages/shop.tsx", { id: "loja-alias" }),
  route("sobre-nos", "pages/sobre-nos.tsx"),
  route("terroir", "pages/terroir-redirect.tsx"),
  route("avaliacoes", "pages/avaliacoes.tsx"),
  route("contactos", "pages/contacts.tsx"),
  route("checkout", "pages/checkout.tsx"),
  route("api/catalog", "pages/api/catalog.ts"),
  route("api/forms", "pages/api/forms.ts"),
  // Autenticação pública do painel e rotas protegidas por sessão + role admin.
  route("admin/login", "pages/admin/login.tsx"),
  route("admin/logout", "pages/admin/logout.tsx"),
  route("admin", "pages/admin/protected-layout.tsx", [
    index("pages/admin/dashboard.tsx"),
    route("produtos", "pages/admin/products.tsx"),
    route("caixa-entrada", "pages/admin/inbox.tsx"),
    route("admins", "pages/admin/admins.tsx"),
    route("api/products", "pages/api/products.ts"),
    route("api/vendus-sync", "pages/api/vendus-sync.ts"),
  ]),
] satisfies RouteConfig;

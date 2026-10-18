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
  // Painel de Administração
  route("admin", "pages/admin/dashboard.tsx"),
  route("admin/produtos", "pages/admin/products.tsx"),
  route("admin/admins", "pages/admin/admins.tsx"),
] satisfies RouteConfig;
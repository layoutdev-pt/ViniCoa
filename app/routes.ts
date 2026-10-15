import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/home.tsx"),
  route("vinhos", "pages/shop.tsx"),
  route("vinhos/:id", "pages/wine-detail.tsx"),
  route("loja", "pages/shop.tsx", { id: "loja-alias" }),
  route("terroir", "pages/terroir.tsx"),
  route("contactos", "pages/contacts.tsx"),
  route("checkout", "pages/checkout.tsx"),
] satisfies RouteConfig;
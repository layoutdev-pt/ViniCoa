import { redirect } from "react-router";

// O antigo URL /terroir passou a /sobre-nos; mantém links e pesquisas antigas a funcionar
export function loader() {
  return redirect("/sobre-nos", 301);
}

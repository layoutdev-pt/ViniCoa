import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite"; // Adiciona esta linha
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(), // Injeta o Tailwind v4 no pipeline do Vite
    reactRouter(),
  ],
  resolve: {
    // Espelha o alias "~/*" do tsconfig.json sem depender de vite-tsconfig-paths
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
});

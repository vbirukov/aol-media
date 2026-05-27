import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  optimizeDeps: {
    include: ["@tanstack/react-virtual"],
    exclude: ["@vbonline/player"],
  },
  worker: {
    format: "es",
  },
  ssr: {
    noExternal: ["@vbonline/player"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, "index.html"),
        embed: path.resolve(rootDir, "embed.html"),
      },
    },
  },
});

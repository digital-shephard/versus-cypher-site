import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL("./index.html", import.meta.url)),
        howItWorks: fileURLToPath(new URL("./how-it-works/index.html", import.meta.url)),
        protocol: fileURLToPath(new URL("./protocol/index.html", import.meta.url)),
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
});

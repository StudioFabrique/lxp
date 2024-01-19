import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: "./index.html",
    },
    outDir: "../api/dist/public/",
  },
  server: {
    headers: {
      "Content-Security-Policy": `default-src 'self'; script-src 'self' https://www.youtube.com/iframe_api;`,
    },
  },
});

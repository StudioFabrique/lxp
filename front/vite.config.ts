import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],
    build: {
      manifest: true,
      rolldownOptions: { input: "./index.html" },
      outDir: "../api/dist/public/",
    },
    server: {
      port: 5173,
    },
  };
});

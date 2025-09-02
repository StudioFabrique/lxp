import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

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
    https: {
      key: fs.readFileSync("./certs/node-server-key.pem"),
      cert: fs.readFileSync("./certs/node-server-cert.pem"),
    },
    port: 5173,
  },
});

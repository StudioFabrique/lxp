import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ mode }) => {
  // Charge les variables d'env selon le mode (development/production)
  // Le 3e param '' = charge TOUTES les vars, pas seulement VITE_
  const env = loadEnv(mode, process.cwd(), "");

  // Assure-toi que le nom est cohérent : VITE_HTTPS_ENABLED (et pas VITE_HTTP_ENABLED)
  const httpsEnabled = env.VITE_HTTPS_ENABLED === "true";

  return {
    plugins: [react()],
    build: {
      manifest: true,
      rollupOptions: { input: "./index.html" },
      outDir: "../api/dist/public/",
    },
    server: {
      https: httpsEnabled
        ? {
            key: fs.readFileSync("./certs/node-server-key.pem"),
            cert: fs.readFileSync("./certs/node-server-cert.pem"),
          }
        : undefined,
      port: 5173,
    },
  };
});

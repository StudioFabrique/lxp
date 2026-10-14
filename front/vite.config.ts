import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Remplace le bandeau de Vite par un affichage cohérent avec celui de l'API :
// un bloc par service, avec le rôle du port et l'action possible sous l'adresse.
// Les couleurs sont désactivées quand NO_COLOR est défini.
const useColor = !process.env.NO_COLOR;
const ansi = (code: string, text: string) =>
  useColor ? `\x1b[${code}m${text}\x1b[0m` : text;

function startupBanner(): Plugin {
  return {
    name: "startup-banner",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        const url = server.resolvedUrls?.local[0];
        if (!url) return;
        const technologies = "React / TypeScript / Vite / Tailwind / DaisyUI";
        const border = ansi("2", "─".repeat(technologies.length));
        console.log(
          [
            "",
            `  ${ansi("1;30;46", " INTERFACE WEB ")} ${ansi("36", "navigateur")}`,
            "",
            `  ${border}`,
            `  ${ansi("2", technologies)}`,
            `  ${border}`,
            "",
            `  ${ansi("1;36", url)}`,
            `  ${ansi("2", "Cmd/Ctrl + clic sur le lien pour ouvrir l'application")}`,
            "",
          ].join("\n"),
        );
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), startupBanner()],
    // Seuls les avertissements et erreurs restent ; le bandeau ci-dessus remplace les infos.
    logLevel: "warn" as const,
    build: {
      manifest: true,
      rolldownOptions: { input: "./index.html" },
      outDir: "../api/dist/public/",
      // Ce dossier contient uniquement le front généré ; l'API est dans dist/src.
      emptyOutDir: true,
    },
    server: {
      port: 5173,
    },
  };
});

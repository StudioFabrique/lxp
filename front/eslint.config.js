import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  ...typescriptEslint.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      ...reactHooks.configs.flat.recommended.plugins,
      ...reactRefresh.configs.vite.plugins,
    },
    rules: {
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // --- Dette existante, signalée mais non bloquante ---
      //
      // Ces règles portent sur du code antérieur à leur adoption : les règles
      // du compilateur React sont arrivées avec eslint-plugin-react-hooks 7 et
      // signalent des schémas en place de longue date. Les laisser en erreur
      // rendrait l'intégration continue rouge en permanence, donc inutile ;
      // les désactiver ferait disparaître le problème du radar.
      //
      // En avertissement, toute nouvelle violation des autres règles bloque,
      // et le reste reste comptabilisé. Décompte au moment de ce réglage :
      //   75  @typescript-eslint/no-explicit-any
      //   60  react-hooks/set-state-in-effect
      //   25  react-hooks/refs
      //    4  react-hooks/purity
      //    2  react-hooks/preserve-manual-memoization
      //    2  react-hooks/static-components
      //    2  react-hooks/set-state-in-render
      //    1  react-hooks/immutability
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/immutability": "warn",
    },
  },
];

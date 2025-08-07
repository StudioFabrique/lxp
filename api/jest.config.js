/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Gardez commenté
  testTimeout: 30000, // ← Optionnel : timeout plus long pour les tests DB
  forceExit: true, // ← Force la fermeture après les tests
  detectOpenHandles: true, // ← Aide à identifier les handles ouverts
  verbose: true,

  // Ajoutez explicitement les patterns de test
  testMatch: ["**/tests/**/*.spec.ts", "**/tests/**/*.test.ts"],

  // Assurez-vous que TypeScript est bien transformé
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

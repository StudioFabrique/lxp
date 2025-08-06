/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // ← Ajoutez cette ligne
  testTimeout: 30000, // ← Optionnel : timeout plus long pour les tests DB
  forceExit: true, // ← Force la fermeture après les tests
  detectOpenHandles: true, // ← Aide à identifier les handles ouverts
};

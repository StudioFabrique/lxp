import mongoose from "mongoose";
import mongoConnect from "../utils/services/db/mongo-connect.ts";
import { initializeDropoutAnalysis, startDropoutAnalysisWorker } from "../services/dropout-analysis.ts";
import { logger } from "../utils/logs/logger.ts";

await mongoConnect();
await initializeDropoutAnalysis();
const stop = startDropoutAnalysisWorker();

async function shutdown() {
  await stop();
  await mongoose.disconnect();
}

process.once("SIGTERM", () => void shutdown().catch((error) => {
  logger.error("Arrêt du worker de décrochage impossible", error);
  process.exitCode = 1;
}));
process.once("SIGINT", () => void shutdown().catch((error) => {
  logger.error("Arrêt du worker de décrochage impossible", error);
  process.exitCode = 1;
}));

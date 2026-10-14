import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, json } = winston.format;

const logPath = path.join(import.meta.dirname, "..", "..", "..", "logs");

const transportInfo = new winston.transports.DailyRotateFile({
  level: "info",
  filename: logPath + "/application-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

export const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json()
  ),
  transports: [
    // En développement, la console ne reçoit que les avertissements et erreurs ;
    // le détail (info, http) reste disponible dans les fichiers de logs.
    new winston.transports.Console({
      level: process.env.NODE_ENV === "development" ? "warn" : "http",
    }),
    transportInfo,
  ],
});

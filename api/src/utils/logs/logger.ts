import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const { combine, timestamp, json } = winston.format;

const logPath = path.join(__dirname, "..", "..", "..", "logs");

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
  transports: [new winston.transports.Console(), transportInfo],
});

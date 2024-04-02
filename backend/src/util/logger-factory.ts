import { format, transports } from "winston";
const { json, timestamp } = format;
require("winston-daily-rotate-file");
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from "nest-winston";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import DailyRotateFile from "winston-daily-rotate-file";

export const LoggerFactory = (appName: string) => {
  //DailyRotateFile func()
  const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/logs-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
  });

  const consoleFormat = format.combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    json(),
    nestWinstonModuleUtilities.format.nestLike(appName, {
      colors: true,
      prettyPrint: true,
    }),
  );

  return WinstonModule.createLogger({
    level: "info",
    transports: [
      fileRotateTransport,
      new transports.Console({ format: consoleFormat }),
    ],
  });
};

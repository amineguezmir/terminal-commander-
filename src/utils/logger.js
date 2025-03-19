import chalk from "chalk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file path
const logFile = path.join(logsDir, "terminal-commander.log");

// Logger levels
const LOG_LEVELS = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

// Format date for log entries
function formatDate(date) {
  return date.toISOString();
}

// Write to log file
function writeToLogFile(level, message, data) {
  try {
    const timestamp = formatDate(new Date());
    const logEntry = `[${timestamp}] [${level}] ${message}${
      data ? ` - ${JSON.stringify(data)}` : ""
    }\n`;

    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error(chalk.red(`Failed to write to log file: ${error.message}`));
  }
}

// Logger functions
export const logger = {
  debug: (message, data) => {
    writeToLogFile(LOG_LEVELS.DEBUG, message, data);
  },

  info: (message, data) => {
    writeToLogFile(LOG_LEVELS.INFO, message, data);
  },

  warn: (message, data) => {
    console.warn(chalk.yellow(`WARN: ${message}`));
    writeToLogFile(LOG_LEVELS.WARN, message, data);
  },

  error: (message, error) => {
    console.error(chalk.red(`ERROR: ${message}`));
    if (error) {
      console.error(chalk.red(error.stack || error.message));
    }
    writeToLogFile(
      LOG_LEVELS.ERROR,
      message,
      error ? { message: error.message, stack: error.stack } : null
    );
  },
};

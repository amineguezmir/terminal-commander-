import chalk from "chalk";
import { logger } from "./logger.js";

/**
 * Centralized error handler
 * @param {string} context - Where the error occurred
 * @param {Error|string} error - The error object or message
 */
export function handleError(context, error) {
  // Log the error
  logger.error(
    `${context}: ${error instanceof Error ? error.message : error}`,
    error
  );

  // Display user-friendly message
  console.error(chalk.red(`\n⚠️ ${context}`));

  if (process.env.NODE_ENV === "development") {
    // Show detailed error in development mode
    console.error(chalk.dim(error instanceof Error ? error.stack : error));
  } else {
    // Show simplified error in production
    console.error(
      chalk.dim("An error occurred. Check the logs for more details.")
    );
  }
}

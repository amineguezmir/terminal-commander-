import chalk from "chalk";
import boxen from "boxen";
import { tips } from "../data/tips.js";
import { logger } from "../utils/logger.js";

/**
 * Show a random tip to the user
 * @param {string} os - Operating system
 * @param {object} config - Config store instance
 */
export function showRandomTip(os, config) {
  try {
    // Check if tips are enabled in settings
    const showTips = config.get("settings")?.showTips !== false;

    if (!showTips) {
      console.log(chalk.yellow("Tips are currently disabled in settings."));
      return;
    }

    const osTips = tips[os];
    const tip = osTips[Math.floor(Math.random() * osTips.length)];

    console.log(
      boxen(chalk.bold.cyan("💡 Terminal Tip 💡\n\n") + chalk.white(tip), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      })
    );

    logger.info("User viewed a random tip");
  } catch (error) {
    logger.error("Error showing random tip", error);
    console.error(chalk.red("Error showing tip. Please try again."));
  }
}

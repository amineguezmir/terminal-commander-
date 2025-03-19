import chalk from "chalk";
import boxen from "boxen";
import { logger } from "../utils/logger.js";

/**
 * Display user stats
 * @param {object} config - Config store instance
 */
export function displayStats(config) {
  try {
    const xp = config.get("xp");
    const level = config.get("level");
    const completedChallenges = config.get("completedChallenges").length;
    const badges = config.get("badges");
    const commandHistory = config.get("commandHistory");
    const lastUsed = config.get("lastUsed");

    // Calculate XP needed for next level
    const nextLevelXP = level * 100;
    const xpProgress = Math.floor((xp / nextLevelXP) * 100);

    // Create progress bar
    const progressBarLength = 20;
    const filledLength = Math.floor((xpProgress / 100) * progressBarLength);
    const progressBar =
      "█".repeat(filledLength) + "░".repeat(progressBarLength - filledLength);

    console.log(
      boxen(
        chalk.bold.yellow("🏆 Your Progress 🏆\n\n") +
          chalk.blue(`Level: ${level}\n`) +
          chalk.green(`XP: ${xp} / ${nextLevelXP}\n`) +
          chalk.cyan(`Progress: [${progressBar}] ${xpProgress}%\n\n`) +
          chalk.magenta(`Challenges Completed: ${completedChallenges}\n`) +
          chalk.yellow(`Commands Learned: ${commandHistory.length}\n`) +
          chalk.cyan(
            `Badges (${badges.length}): ${
              badges.length ? badges.join(", ") : "None yet"
            }`
          ),
        {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "yellow",
        }
      )
    );

    // Show streak information if available
    if (lastUsed) {
      const lastUsedDate = new Date(lastUsed);
      const today = new Date();
      const diffDays = Math.floor(
        (today - lastUsedDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        console.log(chalk.green("🔥 You're on a learning streak today!"));
      }
    }

    logger.info("User viewed stats");
  } catch (error) {
    logger.error("Error displaying stats", error);
    console.error(chalk.red("Error displaying stats. Please try again."));
  }
}

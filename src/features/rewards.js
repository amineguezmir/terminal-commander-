import chalk from "chalk";
import boxen from "boxen";
import { logger } from "../utils/logger.js";

/**
 * Award XP to the user
 * @param {number} amount - Amount of XP to award
 * @param {object} config - Config store instance
 * @returns {object} Updated XP and level
 */
export function awardXP(amount, config) {
  try {
    let xp = config.get("xp");
    let level = config.get("level");

    xp += amount;

    // Level up if XP reaches threshold (100 XP per level)
    if (xp >= level * 100) {
      level++;
      console.log(
        boxen(
          chalk.bold.yellow("🎉 LEVEL UP! 🎉\n\n") +
            chalk.green(`You've reached level ${level}!`),
          {
            padding: 1,
            borderStyle: "double",
            borderColor: "yellow",
          }
        )
      );

      // Award bonus for leveling up
      if (level % 5 === 0) {
        awardBadge(`Level ${level} Master`, config);
      }
    }

    config.set("xp", xp);
    config.set("level", level);

    logger.info(
      `Awarded ${amount} XP to user. New total: ${xp}, Level: ${level}`
    );

    return { xp, level };
  } catch (error) {
    logger.error("Error awarding XP", error);
    return { xp: config.get("xp"), level: config.get("level") };
  }
}

/**
 * Award a badge to the user
 * @param {string} badge - Badge name
 * @param {object} config - Config store instance
 * @returns {boolean} Success status
 */
export function awardBadge(badge, config) {
  try {
    const badges = config.get("badges");

    if (!badges.includes(badge)) {
      badges.push(badge);
      config.set("badges", badges);

      console.log(
        boxen(
          chalk.bold.magenta("🏅 NEW BADGE EARNED! 🏅\n\n") +
            chalk.cyan(`You've earned the "${badge}" badge!`),
          {
            padding: 1,
            borderStyle: "round",
            borderColor: "magenta",
          }
        )
      );

      logger.info(`Awarded badge "${badge}" to user`);
      return true;
    }

    return false;
  } catch (error) {
    logger.error(`Error awarding badge: ${badge}`, error);
    return false;
  }
}

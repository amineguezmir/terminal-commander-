import chalk from "chalk";
import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import boxen from "boxen";
import { challenges } from "../data/challenges.js";
import { awardXP, awardBadge } from "./rewards.js";
import { logger } from "../utils/logger.js";

/**
 * Start a command challenge
 * @param {string} os - Operating system
 * @param {object} config - Config store instance
 */
export async function startChallenge(os, config) {
  try {
    const completedChallenges = config.get("completedChallenges");
    const availableChallenges = challenges[os].filter(
      (c) => !completedChallenges.includes(c.id)
    );

    if (availableChallenges.length === 0) {
      console.log(
        chalk.yellow(
          "You have completed all available challenges! More coming soon."
        )
      );
      return;
    }

    // Get difficulty level from settings
    const difficultyLevel =
      config.get("settings")?.difficultyLevel || "beginner";

    // Filter challenges by difficulty if not on beginner mode
    let filteredChallenges = availableChallenges;
    if (difficultyLevel !== "beginner") {
      filteredChallenges = availableChallenges.filter(
        (c) => c.difficulty === difficultyLevel
      );

      // If no challenges match the difficulty, fall back to all available challenges
      if (filteredChallenges.length === 0) {
        filteredChallenges = availableChallenges;
      }
    }

    // Select a random challenge
    const challenge =
      filteredChallenges[Math.floor(Math.random() * filteredChallenges.length)];

    console.log(
      boxen(
        chalk.bold.green(`Challenge: ${challenge.title}\n\n`) +
          chalk.white(`${challenge.description}\n\n`) +
          chalk.yellow("Hint: ") +
          chalk.dim(challenge.hint),
        {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "green",
        }
      )
    );

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      const { answer } = await inquirer.prompt({
        type: "input",
        name: "answer",
        message: `Enter the command to solve this challenge (Attempt ${
          attempts + 1
        }/${maxAttempts}):`,
        validate: (input) => input.trim() !== "" || "Please enter a command",
      });

      const spinner = createSpinner("Checking your answer...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (answer.trim() === challenge.solution) {
        spinner.success({ text: "Correct! Challenge completed!" });

        // Mark challenge as completed
        completedChallenges.push(challenge.id);
        config.set("completedChallenges", completedChallenges);

        // Award XP based on difficulty and attempts
        const baseXP = 25;
        const difficultyMultiplier =
          difficultyLevel === "beginner"
            ? 1
            : difficultyLevel === "intermediate"
            ? 1.5
            : 2;
        const attemptBonus = maxAttempts - attempts;

        const xpAwarded = Math.floor(
          baseXP * difficultyMultiplier + attemptBonus * 5
        );
        awardXP(xpAwarded, config);

        console.log(
          chalk.green(
            `You earned ${xpAwarded} XP for completing this challenge!`
          )
        );

        // Check for badge eligibility
        if (completedChallenges.length >= 3)
          awardBadge("Challenge Beginner", config);
        if (completedChallenges.length >= 10)
          awardBadge("Challenge Expert", config);
        if (completedChallenges.length >= 20)
          awardBadge("Challenge Master", config);

        // Special badges for completing all challenges in a category
        const osChallenges = challenges[os];
        const osCompletedChallenges = completedChallenges.filter((id) =>
          osChallenges.some((c) => c.id === id)
        );

        if (osCompletedChallenges.length === osChallenges.length) {
          awardBadge(
            `${os.charAt(0).toUpperCase() + os.slice(1)} Master`,
            config
          );
        }

        logger.info(`User completed challenge: ${challenge.id}`);
        return;
      } else {
        attempts++;

        if (attempts < maxAttempts) {
          spinner.error({ text: "Not quite right. Try again!" });
          console.log(chalk.dim(`Hint: ${challenge.hint}`));

          // Provide additional hint after second attempt
          if (attempts === 2) {
            const additionalHint =
              challenge.additionalHint ||
              "Think about the specific flags or options needed.";
            console.log(chalk.yellow(`Additional hint: ${additionalHint}`));
          }
        } else {
          spinner.error({ text: "Challenge not completed." });
          console.log(
            chalk.yellow(
              `The correct command was: ${chalk.green(challenge.solution)}`
            )
          );
          console.log(
            chalk.cyan("Don't worry! You can try another challenge.")
          );

          // Award a small amount of XP for trying
          awardXP(5, config);

          logger.info(
            `User failed challenge: ${challenge.id} after ${attempts} attempts`
          );
        }
      }
    }
  } catch (error) {
    logger.error("Error in challenge", error);
    console.error(chalk.red("Error during challenge. Please try again."));
  }
}

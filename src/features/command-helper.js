import chalk from "chalk";
import boxen from "boxen";
import { commands } from "../data/commands.js";
import { awardXP, awardBadge } from "./rewards.js";
import { logger } from "../utils/logger.js";

/**
 * Explain a command to the user
 * @param {string} commandName - Name of the command to explain
 * @param {string} os - Operating system
 * @param {object} config - Config store instance
 * @returns {boolean} Success status
 */
export function explainCommand(commandName, os, config) {
  try {
    const command = commands[os]?.find(
      (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
    );

    if (!command) {
      console.log(
        chalk.red(
          `Command "${commandName}" not found or not supported in ${os}.`
        )
      );

      // Suggest similar commands
      const allCommands = commands[os];
      const similarCommands = allCommands
        .filter(
          (cmd) =>
            cmd.name.includes(commandName) ||
            (cmd.aliases &&
              cmd.aliases.some((alias) => alias.includes(commandName)))
        )
        .slice(0, 3);

      if (similarCommands.length > 0) {
        console.log(chalk.yellow("\nDid you mean:"));
        similarCommands.forEach((cmd) => {
          console.log(
            chalk.cyan(
              `  ${cmd.name}${
                cmd.aliases ? ` (${cmd.aliases.join(", ")})` : ""
              }`
            )
          );
        });
      }

      return false;
    }

    // Get color theme from settings
    const colorTheme = config.get("settings")?.colorTheme || "default";

    // Define colors based on theme
    let titleColor = chalk.bold.cyan;
    let descColor = chalk.white;
    let usageColor = chalk.yellow;
    let exampleColor = chalk.green;
    let tipColor = chalk.magenta;

    if (colorTheme === "dark") {
      titleColor = chalk.bold.blue;
      descColor = chalk.gray;
      usageColor = chalk.yellow;
      exampleColor = chalk.green;
      tipColor = chalk.magenta;
    } else if (colorTheme === "light") {
      titleColor = chalk.bold.blue;
      descColor = chalk.black;
      usageColor = chalk.yellow;
      exampleColor = chalk.green;
      tipColor = chalk.magenta;
    } else if (colorTheme === "colorblind") {
      titleColor = chalk.bold.blue;
      descColor = chalk.white;
      usageColor = chalk.cyan;
      exampleColor = chalk.yellow;
      tipColor = chalk.blue;
    }

    console.log(
      boxen(
        titleColor(`Command: ${command.name}\n\n`) +
          descColor(`${command.description}\n\n`) +
          usageColor("Usage:\n") +
          exampleColor(`  ${command.usage}\n\n`) +
          usageColor("Examples:\n") +
          command.examples.map((ex) => exampleColor(`  ${ex}`)).join("\n") +
          (command.tip ? `\n\n${tipColor("💡 Tip: " + command.tip)}` : ""),
        {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "blue",
        }
      )
    );

    // Track command in history
    const history = config.get("commandHistory");
    if (!history.includes(commandName)) {
      history.push(commandName);
      config.set("commandHistory", history);

      // Award XP for learning a new command
      awardXP(10, config);

      // Check for badge eligibility
      if (history.length >= 5) awardBadge("Command Novice", config);
      if (history.length >= 15) awardBadge("Command Adept", config);
      if (history.length >= 30) awardBadge("Command Master", config);

      // Special badges for specific command categories
      const fileCommands = ["ls", "dir", "find", "grep", "cat"];
      const networkCommands = [
        "ping",
        "ifconfig",
        "ipconfig",
        "netstat",
        "ssh",
      ];
      const processCommands = ["ps", "top", "kill", "tasklist", "taskkill"];

      const learnedFileCommands = history.filter((cmd) =>
        fileCommands.includes(cmd)
      );
      const learnedNetworkCommands = history.filter((cmd) =>
        networkCommands.includes(cmd)
      );
      const learnedProcessCommands = history.filter((cmd) =>
        processCommands.includes(cmd)
      );

      if (learnedFileCommands.length >= 3)
        awardBadge("File System Expert", config);
      if (learnedNetworkCommands.length >= 3)
        awardBadge("Network Ninja", config);
      if (learnedProcessCommands.length >= 3)
        awardBadge("Process Wizard", config);
    }

    logger.info(`User learned about command: ${commandName}`);
    return true;
  } catch (error) {
    logger.error(`Error explaining command: ${commandName}`, error);
    console.error(chalk.red("Error explaining command. Please try again."));
    return false;
  }
}

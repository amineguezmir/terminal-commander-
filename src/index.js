#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import figlet from "figlet";
import gradient from "gradient-string";
import Conf from "conf";
import { createSpinner } from "nanospinner";
import boxen from "boxen";
import { commands } from "./data/commands.js";
import { easterEggs } from "./features/easter-eggs.js";
import { awardXP } from "./features/rewards.js";
import { displayStats } from "./features/stats.js";
import { explainCommand } from "./features/command-helper.js";
import { startChallenge } from "./features/challenges.js";
import { showRandomTip } from "./features/tips.js";
import { handleError } from "./utils/error-handler.js";

// Initialize config store with schema validation
const config = new Conf({
  projectName: "terminal-commander",
  schema: {
    os: {
      type: "string",
      enum: ["linux", "windows", "mac"],
      default: "windows", // Set a default for Windows users
    },
    xp: {
      type: "number",
      minimum: 0,
      default: 0,
    },
    level: {
      type: "number",
      minimum: 1,
      default: 1,
    },
    completedChallenges: {
      type: "array",
      items: {
        type: "string",
      },
      default: [],
    },
    commandHistory: {
      type: "array",
      items: {
        type: "string",
      },
      default: [],
    },
    badges: {
      type: "array",
      items: {
        type: "string",
      },
      default: [],
    },
    settings: {
      type: "object",
      properties: {
        colorTheme: {
          type: "string",
          enum: ["default", "dark", "light", "colorblind"],
          default: "default",
        },
        showTips: {
          type: "boolean",
          default: true,
        },
        difficultyLevel: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
          default: "beginner",
        },
      },
      default: {
        colorTheme: "default",
        showTips: true,
        difficultyLevel: "beginner",
      },
    },
    lastUsed: {
      type: "string",
      format: "date-time",
      default: new Date().toISOString(),
    },
  },
});

// Ensure OS is set to a valid value initially
if (
  !config.has("os") ||
  !["linux", "windows", "mac"].includes(config.get("os"))
) {
  config.set("os", "windows"); // Default to Windows for Windows users
}

// Display welcome banner
function displayBanner() {
  try {
    console.clear();
    const title = figlet.textSync("Terminal Commander", {
      font: "ANSI Shadow",
      horizontalLayout: "fitted",
    });

    console.log(gradient.pastel.multiline(title));
    console.log(
      boxen(
        chalk.bold("Your interactive terminal command assistant!\n") +
          chalk.dim("Learn commands, complete challenges, earn badges"),
        {
          padding: 1,
          margin: 1,
          borderStyle: "round",
          borderColor: "cyan",
        }
      )
    );

    // Show streak information if user has been using the app
    const lastUsed = config.get("lastUsed");
    if (lastUsed) {
      const lastUsedDate = new Date(lastUsed);
      const today = new Date();
      const diffDays = Math.floor(
        (today - lastUsedDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 0) {
        console.log(
          chalk.green("🔥 Welcome back! You're on a learning streak!")
        );
      } else if (diffDays === 1) {
        console.log(
          chalk.green("🔥 Welcome back! You're maintaining your daily streak!")
        );
        awardXP(5, config); // Bonus XP for daily use
      } else {
        console.log(
          chalk.yellow(
            `Welcome back! It's been ${diffDays} days since your last session.`
          )
        );
      }
    }

    // Update last used timestamp
    config.set("lastUsed", new Date().toISOString());
  } catch (error) {
    handleError("Error displaying banner", error);
    // Fallback to simple text if figlet fails
    console.log(chalk.bold.cyan("\n=== Terminal Commander ===\n"));
  }
}

// Select operating system
async function selectOS() {
  try {
    const savedOS = config.get("os");

    // Always ask for OS selection on first run
    const { os } = await inquirer.prompt({
      type: "list",
      name: "os",
      message: "Which operating system are you using?",
      choices: [
        { name: "🐧 Linux", value: "linux" },
        { name: "🪟 Windows", value: "windows" },
        { name: "🍎 macOS", value: "mac" },
      ],
      default: savedOS, // Pre-select the saved OS
    });

    config.set("os", os);

    const spinner = createSpinner("Configuring for your OS...").start();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.success({
      text: `Configured for ${chalk.green(os.toUpperCase())}!`,
    });

    return os;
  } catch (error) {
    handleError("Error selecting OS", error);
    // Default to Windows if there's an error
    return "windows";
  }
}

// Reset user progress
async function resetProgress() {
  try {
    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message:
        "Are you sure you want to reset all your progress? This cannot be undone.",
      default: false,
    });

    if (confirm) {
      const spinner = createSpinner("Resetting progress...").start();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Keep OS setting but reset everything else
      const currentOS = config.get("os");
      const currentSettings = config.get("settings");

      config.set("xp", 0);
      config.set("level", 1);
      config.set("completedChallenges", []);
      config.set("commandHistory", []);
      config.set("badges", []);

      // Restore OS and settings
      config.set("os", currentOS);
      config.set("settings", currentSettings);

      spinner.success({ text: "Progress reset successfully!" });
    }
  } catch (error) {
    handleError("Error resetting progress", error);
  }
}

// Settings menu
async function settingsMenu() {
  try {
    const currentSettings = config.get("settings");

    const { setting } = await inquirer.prompt({
      type: "list",
      name: "setting",
      message: "Settings:",
      choices: [
        {
          name: `Color Theme: ${currentSettings.colorTheme}`,
          value: "colorTheme",
        },
        {
          name: `Show Tips: ${currentSettings.showTips ? "Yes" : "No"}`,
          value: "showTips",
        },
        {
          name: `Difficulty Level: ${currentSettings.difficultyLevel}`,
          value: "difficultyLevel",
        },
        { name: "Back to Main Menu", value: "back" },
      ],
    });

    if (setting === "back") {
      return;
    }

    if (setting === "colorTheme") {
      const { theme } = await inquirer.prompt({
        type: "list",
        name: "theme",
        message: "Select color theme:",
        choices: [
          { name: "Default", value: "default" },
          { name: "Dark", value: "dark" },
          { name: "Light", value: "light" },
          { name: "Colorblind Friendly", value: "colorblind" },
        ],
        default: currentSettings.colorTheme,
      });

      currentSettings.colorTheme = theme;
    } else if (setting === "showTips") {
      const { show } = await inquirer.prompt({
        type: "confirm",
        name: "show",
        message: "Show tips during sessions?",
        default: currentSettings.showTips,
      });

      currentSettings.showTips = show;
    } else if (setting === "difficultyLevel") {
      const { level } = await inquirer.prompt({
        type: "list",
        name: "level",
        message: "Select difficulty level:",
        choices: [
          { name: "Beginner", value: "beginner" },
          { name: "Intermediate", value: "intermediate" },
          { name: "Advanced", value: "advanced" },
        ],
        default: currentSettings.difficultyLevel,
      });

      currentSettings.difficultyLevel = level;
    }

    config.set("settings", currentSettings);
    console.log(chalk.green("Settings updated!"));

    // Recursive call to stay in settings menu
    return settingsMenu();
  } catch (error) {
    handleError("Error in settings menu", error);
  }
}

// Command search
async function searchCommands(os) {
  try {
    const { searchTerm } = await inquirer.prompt({
      type: "input",
      name: "searchTerm",
      message: "Enter search term:",
      validate: (input) => input.trim() !== "" || "Please enter a search term",
    });

    const term = searchTerm.toLowerCase().trim();
    const osCommands = commands[os];

    const results = osCommands.filter(
      (cmd) =>
        cmd.name.includes(term) ||
        cmd.description.toLowerCase().includes(term) ||
        (cmd.aliases && cmd.aliases.some((alias) => alias.includes(term)))
    );

    if (results.length === 0) {
      console.log(chalk.yellow(`No commands found matching "${searchTerm}"`));
      return;
    }

    console.log(
      chalk.cyan(
        `\nFound ${results.length} commands matching "${searchTerm}":\n`
      )
    );

    const { selectedCommand } = await inquirer.prompt({
      type: "list",
      name: "selectedCommand",
      message: "Select a command to learn more:",
      choices: results.map((cmd) => ({
        name: `${cmd.name}${
          cmd.aliases ? ` (${cmd.aliases.join(", ")})` : ""
        } - ${cmd.description.substring(0, 60)}...`,
        value: cmd.name,
      })),
    });

    explainCommand(selectedCommand, os, config);
  } catch (error) {
    handleError("Error searching commands", error);
  }
}

// Main menu
async function mainMenu(os) {
  try {
    while (true) {
      const { action } = await inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "🔍 Learn a command", value: "learn" },
          { name: "🔎 Search commands", value: "search" },
          { name: "🎮 Take a challenge", value: "challenge" },
          { name: "📊 View your stats", value: "stats" },
          { name: "💡 Get a random tip", value: "tip" },
          { name: "⚙️ Settings", value: "settings" },
          { name: "🔄 Change OS", value: "change_os" },
          { name: "⚠️ Reset progress", value: "reset" },
          { name: "👋 Exit", value: "exit" },
        ],
      });

      switch (action) {
        case "learn":
          const { commandName } = await inquirer.prompt({
            type: "input",
            name: "commandName",
            message: "Enter the command you want to learn about:",
            validate: (input) =>
              input.trim() !== "" || "Please enter a command name",
          });

          const result = explainCommand(commandName.trim(), os, config);

          // Check for Easter eggs
          if (result && easterEggs[os] && easterEggs[os][commandName.trim()]) {
            await easterEggs[os][commandName.trim()](config);
          }
          break;

        case "search":
          await searchCommands(os);
          break;

        case "challenge":
          await startChallenge(os, config);
          break;

        case "stats":
          displayStats(config);
          break;

        case "tip":
          showRandomTip(os, config);
          break;

        case "settings":
          await settingsMenu();
          break;

        case "change_os":
          os = await selectOS();
          break;

        case "reset":
          await resetProgress();
          break;

        case "exit":
          console.log(
            chalk.green(
              "Thanks for using Terminal Commander! Happy commanding!"
            )
          );
          return;
      }

      // Pause before showing menu again
      await inquirer.prompt({
        type: "input",
        name: "continue",
        message: "Press Enter to continue...",
      });
    }
  } catch (error) {
    handleError("Error in main menu", error);
    // If there's an error in the main menu, exit gracefully
    console.log(chalk.red("An error occurred. Exiting Terminal Commander."));
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    displayBanner();

    const os = await selectOS();

    // Check for Easter egg
    const easterEggCommands = {
      linux: "cowsay",
      windows: "tree",
      mac: "say",
    };

    console.log(
      chalk.dim(
        `Psst! Try learning about the "${easterEggCommands[os]}" command for a surprise!`
      )
    );

    await mainMenu(os);
  } catch (error) {
    handleError("Error in main function", error);
    process.exit(1);
  }
}

// CLI command setup
program
  .version("1.0.0")
  .description("An interactive terminal command learning tool")
  .action(main);

program
  .command("explain <command>")
  .description("Explain a specific command")
  .action(async (command) => {
    try {
      const os = config.get("os") || (await selectOS());
      explainCommand(command, os, config);
    } catch (error) {
      handleError("Error explaining command", error);
    }
  });

program
  .command("challenge")
  .description("Start a command challenge")
  .action(async () => {
    try {
      const os = config.get("os") || (await selectOS());
      await startChallenge(os, config);
    } catch (error) {
      handleError("Error starting challenge", error);
    }
  });

program
  .command("stats")
  .description("Display your progress stats")
  .action(() => {
    try {
      displayStats(config);
    } catch (error) {
      handleError("Error displaying stats", error);
    }
  });

program
  .command("search")
  .description("Search for commands")
  .action(async () => {
    try {
      const os = config.get("os") || (await selectOS());
      await searchCommands(os);
    } catch (error) {
      handleError("Error searching commands", error);
    }
  });

program
  .command("reset")
  .description("Reset your progress")
  .action(async () => {
    try {
      await resetProgress();
    } catch (error) {
      handleError("Error resetting progress", error);
    }
  });

program.parse();

// If no arguments, run the main program
if (process.argv.length <= 2) {
  main().catch((error) => {
    handleError("Unhandled error in main program", error);
    process.exit(1);
  });
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  handleError("Uncaught exception", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  handleError("Unhandled promise rejection", reason);
  process.exit(1);
});

#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import figlet from "figlet";
import gradient from "gradient-string";
import Conf from "conf";
import { createSpinner } from "nanospinner";
import boxen from "boxen";
import { commands } from "./commands.js";
import { challenges } from "./challenges.js";
import { tips } from "./tips.js";

// Initialize config store
const config = new Conf({
  projectName: "terminal-commander",
  defaults: {
    os: null,
    xp: 0,
    level: 1,
    completedChallenges: [],
    commandHistory: [],
    badges: [],
  },
});

// Display welcome banner
function displayBanner() {
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
}

// Select operating system
async function selectOS() {
  const savedOS = config.get("os");

  if (savedOS) {
    return savedOS;
  }

  const { os } = await inquirer.prompt({
    type: "list",
    name: "os",
    message: "Which operating system are you using?",
    choices: [
      { name: "🐧 Linux", value: "linux" },
      { name: "🪟 Windows", value: "windows" },
      { name: "🍎 macOS", value: "mac" },
    ],
  });

  config.set("os", os);

  const spinner = createSpinner("Configuring for your OS...").start();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.success({ text: `Configured for ${chalk.green(os.toUpperCase())}!` });

  return os;
}

// Display user stats
function displayStats() {
  const xp = config.get("xp");
  const level = config.get("level");
  const completedChallenges = config.get("completedChallenges").length;
  const badges = config.get("badges");

  console.log(
    boxen(
      chalk.bold.yellow("🏆 Your Progress 🏆\n\n") +
        chalk.blue(`Level: ${level}\n`) +
        chalk.green(`XP: ${xp}\n`) +
        chalk.magenta(`Challenges Completed: ${completedChallenges}\n`) +
        chalk.cyan(`Badges: ${badges.length ? badges.join(", ") : "None yet"}`),
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "yellow",
      }
    )
  );
}

// Award XP to the user
function awardXP(amount) {
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
  }

  config.set("xp", xp);
  config.set("level", level);

  return { xp, level };
}

// Award a badge
function awardBadge(badge) {
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
  }
}

// Explain a command
function explainCommand(commandName, os) {
  const command = commands[os]?.find(
    (cmd) => cmd.name === commandName || cmd.aliases?.includes(commandName)
  );

  if (!command) {
    console.log(
      chalk.red(`Command "${commandName}" not found or not supported in ${os}.`)
    );
    return false;
  }

  console.log(
    boxen(
      chalk.bold.cyan(`Command: ${command.name}\n\n`) +
        chalk.white(`${command.description}\n\n`) +
        chalk.yellow("Usage:\n") +
        chalk.green(`  ${command.usage}\n\n`) +
        chalk.yellow("Examples:\n") +
        command.examples.map((ex) => chalk.green(`  ${ex}`)).join("\n") +
        (command.tip ? `\n\n${chalk.magenta("💡 Tip: " + command.tip)}` : ""),
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
    awardXP(10);

    // Check for badge eligibility
    if (history.length >= 5) awardBadge("Command Novice");
    if (history.length >= 15) awardBadge("Command Adept");
    if (history.length >= 30) awardBadge("Command Master");
  }

  return true;
}

// Start a challenge
async function startChallenge(os) {
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

  // Select a random challenge
  const challenge =
    availableChallenges[Math.floor(Math.random() * availableChallenges.length)];

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

  const { answer } = await inquirer.prompt({
    type: "input",
    name: "answer",
    message: "Enter the command to solve this challenge:",
    validate: (input) => input.trim() !== "" || "Please enter a command",
  });

  const spinner = createSpinner("Checking your answer...").start();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (answer.trim() === challenge.solution) {
    spinner.success({ text: "Correct! Challenge completed!" });

    // Mark challenge as completed
    completedChallenges.push(challenge.id);
    config.set("completedChallenges", completedChallenges);

    // Award XP
    awardXP(25);

    // Check for badge eligibility
    if (completedChallenges.length >= 3) awardBadge("Challenge Beginner");
    if (completedChallenges.length >= 10) awardBadge("Challenge Expert");
  } else {
    spinner.error({ text: "Not quite right. Try again!" });
    console.log(chalk.dim(`Hint: ${challenge.hint}`));
  }
}

// Show a random tip
function showRandomTip(os) {
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
}

// Reset user progress
async function resetProgress() {
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

    config.set("xp", 0);
    config.set("level", 1);
    config.set("completedChallenges", []);
    config.set("commandHistory", []);
    config.set("badges", []);

    spinner.success({ text: "Progress reset successfully!" });
  }
}

// Main menu
async function mainMenu(os) {
  while (true) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { name: "🔍 Learn a command", value: "learn" },
        { name: "🎮 Take a challenge", value: "challenge" },
        { name: "📊 View your stats", value: "stats" },
        { name: "💡 Get a random tip", value: "tip" },
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
        explainCommand(commandName.trim(), os);
        break;

      case "challenge":
        await startChallenge(os);
        break;

      case "stats":
        displayStats();
        break;

      case "tip":
        showRandomTip(os);
        break;

      case "change_os":
        os = await selectOS();
        break;

      case "reset":
        await resetProgress();
        break;

      case "exit":
        console.log(
          chalk.green("Thanks for using Terminal Commander! Happy commanding!")
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
}

// Main function
async function main() {
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
    const os = config.get("os") || (await selectOS());
    explainCommand(command, os);
  });

program
  .command("challenge")
  .description("Start a command challenge")
  .action(async () => {
    const os = config.get("os") || (await selectOS());
    await startChallenge(os);
  });

program
  .command("stats")
  .description("Display your progress stats")
  .action(() => {
    displayStats();
  });

program.parse();

// If no arguments, run the main program
if (process.argv.length <= 2) {
  main();
}

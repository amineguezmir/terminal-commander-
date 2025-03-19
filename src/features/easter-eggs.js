import chalk from "chalk";
import { exec } from "child_process";
import { promisify } from "util";
import { awardBadge, awardXP } from "./rewards.js";
import { logger } from "../utils/logger.js";

const execAsync = promisify(exec);

// Easter egg functions for each OS
export const easterEggs = {
  linux: {
    cowsay: async (config) => {
      try {
        console.log(chalk.magenta("\n🎉 You found an Easter egg! 🎉\n"));

        try {
          const { stdout } = await execAsync("which cowsay");

          if (stdout) {
            console.log(chalk.green("Running cowsay...\n"));

            const { stdout: cowOutput } = await execAsync(
              'cowsay "Moo-velous job finding this Easter egg!"'
            );
            console.log(cowOutput);
          } else {
            // Fallback ASCII cow if cowsay is not installed
            console.log(`
         ___________________________
        < Moo-velous job finding this Easter egg! >
         ---------------------------
                \\   ^__^
                 \\  (oo)\\_______
                    (__)\\       )\\/\\
                        ||----w |
                        ||     ||
            `);
          }
        } catch (error) {
          // Fallback ASCII cow
          console.log(`
       ___________________________
      < Moo-velous job finding this Easter egg! >
       ---------------------------
              \\   ^__^
               \\  (oo)\\_______
                  (__)\\       )\\/\\
                      ||----w |
                      ||     ||
          `);
        }

        awardBadge("Easter Egg Hunter", config);
        awardXP(15, config);

        logger.info("User found cowsay Easter egg");
      } catch (error) {
        logger.error("Error in cowsay Easter egg", error);
      }
    },

    sl: async (config) => {
      try {
        console.log(chalk.magenta("\n🎉 You found an Easter egg! 🎉\n"));

        // ASCII train animation
        console.log(`
                          ____
                         /    \\
   _____________________/______\\___________________________
  |                                                        |
  |  ______________________________________________________|__
  | |                                                         |
  | |                                                         |
  |_|_________________________________________________________|
    |___|___|___|___|___|___|___|___|___|___|___|___|___|___|
  
  All aboard the Terminal Commander Express!
        `);

        awardBadge("Train Conductor", config);
        awardXP(15, config);

        logger.info("User found sl Easter egg");
      } catch (error) {
        logger.error("Error in sl Easter egg", error);
      }
    },
  },

  windows: {
    tree: async (config) => {
      try {
        console.log(chalk.magenta("\n🎉 You found an Easter egg! 🎉\n"));

        // ASCII tree
        console.log(
          chalk.green(`
            /\\
           /  \\
          /    \\
         /      \\
        /        \\
       /          \\
      /            \\
     /              \\
    /                \\
   /                  \\
  /____________________\\
          ||||
          ||||
          ||||
          ||||
          ||||
  
  You've discovered the Terminal Commander tree!
        `)
        );

        awardBadge("Tree Hugger", config);
        awardXP(15, config);

        logger.info("User found tree Easter egg");
      } catch (error) {
        logger.error("Error in tree Easter egg", error);
      }
    },

    cls: async (config) => {
      try {
        console.log(chalk.magenta("\n🎉 You found an Easter egg! 🎉\n"));

        // Hidden message that appears after "clearing" the screen
        console.log(
          chalk.blue(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   Even when the screen is clear,              ║
  ║   knowledge remains!                          ║
  ║                                               ║
  ║   - Terminal Commander                        ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
        `)
        );

        awardBadge("Clear Thinker", config);
        awardXP(15, config);

        logger.info("User found cls Easter egg");
      } catch (error) {
        logger.error("Error in cls Easter egg", error);
      }
    },
  },

  mac: {
    say: async (config) => {
      try {
        console.log(chalk.magenta("\n🎉 You found an Easter egg! 🎉\n"));

        console.log(
          chalk.yellow(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🔊 If your Mac could talk, it would say:    ║
  ║   "You're doing great with Terminal           ║
  ║    Commander! Keep learning!"                 ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
        `)
        );

        try {
          const { stdout } = await execAsync("which say");

          if (stdout) {
            console.log(
              chalk.green("Your Mac is actually saying this right now! 🔊")
            );
            await execAsync(
              'say "You are doing great with Terminal Commander! Keep learning!"'
            );
          }
        } catch (error) {
          // Do nothing if 'say' command is not available
        }

        awardBadge("Voice Activated", config);
        awardXP(15, config);

        logger.info("User found say Easter egg");
      } catch (error) {
        logger.error("Error in say Easter egg", error);
      }
    },

    caffeinate: async (config) => {
      try {
        console.log(chalk.magenta("\n🎉 You found an Easter egg! 🎉\n"));

        console.log(
          chalk.yellow(`
  ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕
  
  Terminal Commander has been caffeinated!
  Your learning powers are now enhanced for this session!
  
  ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕ ☕
        `)
        );

        awardBadge("Caffeinated Coder", config);
        awardXP(20, config); // Extra XP because they're caffeinated!

        logger.info("User found caffeinate Easter egg");
      } catch (error) {
        logger.error("Error in caffeinate Easter egg", error);
      }
    },
  },
};

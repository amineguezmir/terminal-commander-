export const challenges = {
  linux: [
    {
      id: "linux_1",
      title: "Hidden Treasures",
      description:
        "List all files in the current directory, including hidden ones.",
      hint: "Hidden files in Linux start with a dot. Use a flag with ls to see them.",
      solution: "ls -a",
    },
    {
      id: "linux_2",
      title: "Space Explorer",
      description:
        "Find out how much disk space is being used by the current directory.",
      hint: "There's a command that summarizes disk usage.",
      solution: "du -sh",
    },
    {
      id: "linux_3",
      title: "Text Miner",
      description:
        'Find all occurrences of the word "error" in log.txt, ignoring case.',
      hint: "Use grep with a flag to ignore case sensitivity.",
      solution: "grep -i error log.txt",
    },
    {
      id: "linux_4",
      title: "File Finder",
      description:
        "Find all .jpg files in the current directory and its subdirectories.",
      hint: "The find command can search for files by name pattern.",
      solution: 'find . -name "*.jpg"',
    },
    {
      id: "linux_5",
      title: "Process Detective",
      description:
        'Find all running processes that contain "chrome" in their name.',
      hint: "Use ps with grep to filter processes.",
      solution: "ps aux | grep chrome",
    },
    {
      id: "linux_6",
      title: "Permission Master",
      description: "Make a script file executable for the owner only.",
      hint: "chmod can modify permissions for specific users.",
      solution: "chmod u+x script.sh",
    },
    {
      id: "linux_7",
      title: "Directory Builder",
      description:
        "Create a nested directory structure: parent/child/grandchild in one command.",
      hint: "mkdir has a flag to create parent directories.",
      solution: "mkdir -p parent/child/grandchild",
    },
    {
      id: "linux_8",
      title: "System Investigator",
      description: "Display information about the operating system.",
      hint: "There's a command that shows OS information.",
      solution: "uname -a",
    },
  ],
  windows: [
    {
      id: "windows_1",
      title: "File Explorer",
      description:
        "List all files in the current directory, including hidden ones.",
      hint: "The dir command has a flag to show hidden files.",
      solution: "dir /a",
    },
    {
      id: "windows_2",
      title: "Network Detective",
      description:
        "Display detailed information about your network configuration.",
      hint: "ipconfig has a flag to show all details.",
      solution: "ipconfig /all",
    },
    {
      id: "windows_3",
      title: "Text Searcher",
      description:
        'Find all occurrences of the word "error" in log.txt, ignoring case.',
      hint: "Use findstr with a flag to ignore case sensitivity.",
      solution: "findstr /i error log.txt",
    },
    {
      id: "windows_4",
      title: "Process Manager",
      description:
        'List all running processes that contain "chrome" in their name.',
      hint: "Use tasklist with a filter.",
      solution: 'tasklist /fi "imagename eq chrome*"',
    },
    {
      id: "windows_5",
      title: "Directory Mapper",
      description: "Display the directory structure including files.",
      hint: "The tree command can show files too.",
      solution: "tree /f",
    },
    {
      id: "windows_6",
      title: "System Information",
      description: "Display detailed information about your computer system.",
      hint: "There's a command specifically for system information.",
      solution: "systeminfo",
    },
    {
      id: "windows_7",
      title: "File Copier",
      description:
        'Copy all text files from the current directory to a folder named "Backup".',
      hint: "Use copy with wildcards to select all text files.",
      solution: "copy *.txt Backup\\",
    },
    {
      id: "windows_8",
      title: "Network Tester",
      description: "Test the connection to google.com.",
      hint: "There's a command that sends test packets to a server.",
      solution: "ping google.com",
    },
  ],
  mac: [
    {
      id: "mac_1",
      title: "Hidden Treasures",
      description:
        "List all files in the current directory, including hidden ones.",
      hint: "Hidden files in macOS start with a dot. Use a flag with ls to see them.",
      solution: "ls -a",
    },
    {
      id: "mac_2",
      title: "Space Explorer",
      description:
        "Find out how much disk space is being used by the current directory.",
      hint: "There's a command that summarizes disk usage.",
      solution: "du -sh",
    },
    {
      id: "mac_3",
      title: "Text Miner",
      description:
        'Find all occurrences of the word "error" in log.txt, ignoring case.',
      hint: "Use grep with a flag to ignore case sensitivity.",
      solution: "grep -i error log.txt",
    },
    {
      id: "mac_4",
      title: "File Finder",
      description:
        "Find all .jpg files in the current directory and its subdirectories.",
      hint: "The find command can search for files by name pattern.",
      solution: 'find . -name "*.jpg"',
    },
    {
      id: "mac_5",
      title: "Process Detective",
      description:
        'Find all running processes that contain "chrome" in their name.',
      hint: "Use ps with grep to filter processes.",
      solution: "ps aux | grep chrome",
    },
    {
      id: "mac_6",
      title: "App Launcher",
      description: "Open the Calculator application from the terminal.",
      hint: "macOS has a command to open applications.",
      solution: "open -a Calculator",
    },
    {
      id: "mac_7",
      title: "Directory Builder",
      description:
        "Create a nested directory structure: parent/child/grandchild in one command.",
      hint: "mkdir has a flag to create parent directories.",
      solution: "mkdir -p parent/child/grandchild",
    },
    {
      id: "mac_8",
      title: "Talking Terminal",
      description: 'Make your computer say "Hello, Terminal Commander!"',
      hint: "There's a command that converts text to speech.",
      solution: 'say "Hello, Terminal Commander!"',
    },
  ],
};

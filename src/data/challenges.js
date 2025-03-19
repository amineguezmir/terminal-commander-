export const challenges = {
  linux: [
    {
      id: "linux_1",
      title: "Hidden Treasures",
      description:
        "List all files in the current directory, including hidden ones.",
      hint: "Hidden files in Linux start with a dot. Use a flag with ls to see them.",
      additionalHint: 'The flag is a single letter that stands for "all".',
      solution: "ls -a",
      difficulty: "beginner",
    },
    {
      id: "linux_2",
      title: "Space Explorer",
      description:
        "Find out how much disk space is being used by the current directory.",
      hint: "There's a command that summarizes disk usage.",
      additionalHint:
        'The command starts with "du" and needs flags for summary and human-readable format.',
      solution: "du -sh",
      difficulty: "beginner",
    },
    {
      id: "linux_3",
      title: "Text Miner",
      description:
        'Find all occurrences of the word "error" in log.txt, ignoring case.',
      hint: "Use grep with a flag to ignore case sensitivity.",
      additionalHint: "The flag for case-insensitive searching is -i.",
      solution: "grep -i error log.txt",
      difficulty: "beginner",
    },
    {
      id: "linux_4",
      title: "File Finder",
      description:
        "Find all .jpg files in the current directory and its subdirectories.",
      hint: "The find command can search for files by name pattern.",
      additionalHint:
        'Use find with . as the starting point, -name as the search type, and "*.jpg" as the pattern.',
      solution: 'find . -name "*.jpg"',
      difficulty: "intermediate",
    },
    {
      id: "linux_5",
      title: "Process Detective",
      description:
        'Find all running processes that contain "chrome" in their name.',
      hint: "Use ps with grep to filter processes.",
      additionalHint:
        "The full command uses ps aux to list all processes and pipes the output to grep.",
      solution: "ps aux | grep chrome",
      difficulty: "intermediate",
    },
    {
      id: "linux_6",
      title: "Permission Master",
      description: "Make a script file executable for the owner only.",
      hint: "chmod can modify permissions for specific users.",
      additionalHint:
        "Use chmod with u+x to add execute permission for the user (owner).",
      solution: "chmod u+x script.sh",
      difficulty: "intermediate",
    },
    {
      id: "linux_7",
      title: "Directory Builder",
      description:
        "Create a nested directory structure: parent/child/grandchild in one command.",
      hint: "mkdir has a flag to create parent directories.",
      additionalHint:
        "The -p flag allows mkdir to create parent directories as needed.",
      solution: "mkdir -p parent/child/grandchild",
      difficulty: "beginner",
    },
    {
      id: "linux_8",
      title: "System Investigator",
      description: "Display information about the operating system.",
      hint: "There's a command that shows OS information.",
      additionalHint:
        'The command is "uname" and the flag -a shows all information.',
      solution: "uname -a",
      difficulty: "beginner",
    },
    {
      id: "linux_9",
      title: "File Compressor",
      description:
        'Create a compressed tar archive of a directory named "docs".',
      hint: "Use tar with compression flags.",
      additionalHint: "The flags -czvf create a gzipped tar archive.",
      solution: "tar -czvf docs.tar.gz docs",
      difficulty: "intermediate",
    },
    {
      id: "linux_10",
      title: "Text Transformer",
      description:
        'Replace all occurrences of "foo" with "bar" in a file named "text.txt".',
      hint: "Use a stream editor to perform text substitution.",
      additionalHint:
        "The sed command with s/foo/bar/g will substitute all occurrences.",
      solution: "sed -i 's/foo/bar/g' text.txt",
      difficulty: "advanced",
    },
    {
      id: "linux_11",
      title: "Column Extractor",
      description: "Print only the first column of a space-separated file.",
      hint: "There's a text processing tool perfect for column operations.",
      additionalHint: "awk with print $1 will print the first column.",
      solution: "awk '{print $1}' file.txt",
      difficulty: "advanced",
    },
    {
      id: "linux_12",
      title: "File Counter",
      description:
        "Count the number of files in the current directory (not including subdirectories).",
      hint: "Combine ls with a counting tool.",
      additionalHint:
        "Use ls -l to list files and pipe to wc -l to count lines.",
      solution: "ls -l | wc -l",
      difficulty: "intermediate",
    },
  ],
  windows: [
    {
      id: "windows_1",
      title: "File Explorer",
      description:
        "List all files in the current directory, including hidden ones.",
      hint: "The dir command has a flag to show hidden files.",
      additionalHint: "The /a flag shows files with hidden attributes.",
      solution: "dir /a",
      difficulty: "beginner",
    },
    {
      id: "windows_2",
      title: "Network Detective",
      description:
        "Display detailed information about your network configuration.",
      hint: "ipconfig has a flag to show all details.",
      additionalHint: "The /all flag shows complete configuration information.",
      solution: "ipconfig /all",
      difficulty: "beginner",
    },
    {
      id: "windows_3",
      title: "Text Searcher",
      description:
        'Find all occurrences of the word "error" in log.txt, ignoring case.',
      hint: "Use findstr with a flag to ignore case sensitivity.",
      additionalHint: "The /i flag makes the search case-insensitive.",
      solution: "findstr /i error log.txt",
      difficulty: "beginner",
    },
    {
      id: "windows_4",
      title: "Process Manager",
      description:
        'List all running processes that contain "chrome" in their name.',
      hint: "Use tasklist with a filter.",
      additionalHint:
        'The /fi flag filters the output, and "imagename eq chrome*" matches process names.',
      solution: 'tasklist /fi "imagename eq chrome*"',
      difficulty: "intermediate",
    },
    {
      id: "windows_5",
      title: "Directory Mapper",
      description: "Display the directory structure including files.",
      hint: "The tree command can show files too.",
      additionalHint:
        "The /f flag shows files in addition to the directory structure.",
      solution: "tree /f",
      difficulty: "beginner",
    },
    {
      id: "windows_6",
      title: "System Information",
      description: "Display detailed information about your computer system.",
      hint: "There's a command specifically for system information.",
      additionalHint: 'The command is simply "systeminfo".',
      solution: "systeminfo",
      difficulty: "beginner",
    },
    {
      id: "windows_7",
      title: "File Copier",
      description:
        'Copy all text files from the current directory to a folder named "Backup".',
      hint: "Use copy with wildcards to select all text files.",
      additionalHint:
        "The *.txt pattern matches all files with the .txt extension.",
      solution: "copy *.txt Backup\\",
      difficulty: "beginner",
    },
    {
      id: "windows_8",
      title: "Network Tester",
      description: "Test the connection to google.com.",
      hint: "There's a command that sends test packets to a server.",
      additionalHint: "The ping command tests network connectivity.",
      solution: "ping google.com",
      difficulty: "beginner",
    },
    {
      id: "windows_9",
      title: "Port Inspector",
      description: "List all active network connections and listening ports.",
      hint: "There's a command that shows network statistics.",
      additionalHint:
        "netstat with the -a flag shows all connections and listening ports.",
      solution: "netstat -a",
      difficulty: "intermediate",
    },
    {
      id: "windows_10",
      title: "File Attribute Modifier",
      description: 'Make a file named "important.txt" read-only.',
      hint: "Use the attrib command to modify file attributes.",
      additionalHint: "The +r flag adds the read-only attribute.",
      solution: "attrib +r important.txt",
      difficulty: "intermediate",
    },
    {
      id: "windows_11",
      title: "Scheduled Task Creator",
      description: "Create a basic scheduled task that runs notepad.exe daily.",
      hint: "Use the schtasks command to create scheduled tasks.",
      additionalHint:
        "schtasks /create with /sc daily and /tn for task name, /tr for the program to run.",
      solution: 'schtasks /create /sc daily /tn "Run Notepad" /tr notepad.exe',
      difficulty: "advanced",
    },
    {
      id: "windows_12",
      title: "Environment Variable Viewer",
      description: "Display all environment variables.",
      hint: "There's a command to show environment variables.",
      additionalHint:
        "The set command without arguments shows all environment variables.",
      solution: "set",
      difficulty: "beginner",
    },
  ],
  mac: [
    {
      id: "mac_1",
      title: "Hidden Treasures",
      description:
        "List all files in the current directory, including hidden ones.",
      hint: "Hidden files in macOS start with a dot. Use a flag with ls to see them.",
      additionalHint: 'The flag is a single letter that stands for "all".',
      solution: "ls -a",
      difficulty: "beginner",
    },
    {
      id: "mac_2",
      title: "Space Explorer",
      description:
        "Find out how much disk space is being used by the current directory.",
      hint: "There's a command that summarizes disk usage.",
      additionalHint:
        'The command starts with "du" and needs flags for summary and human-readable format.',
      solution: "du -sh",
      difficulty: "beginner",
    },
    {
      id: "mac_3",
      title: "Text Miner",
      description:
        'Find all occurrences of the word "error" in log.txt, ignoring case.',
      hint: "Use grep with a flag to ignore case sensitivity.",
      additionalHint: "The flag for case-insensitive searching is -i.",
      solution: "grep -i error log.txt",
      difficulty: "beginner",
    },
    {
      id: "mac_4",
      title: "File Finder",
      description:
        "Find all .jpg files in the current directory and its subdirectories.",
      hint: "The find command can search for files by name pattern.",
      additionalHint:
        'Use find with . as the starting point, -name as the search type, and "*.jpg" as the pattern.',
      solution: 'find . -name "*.jpg"',
      difficulty: "intermediate",
    },
    {
      id: "mac_5",
      title: "Process Detective",
      description:
        'Find all running processes that contain "chrome" in their name.',
      hint: "Use ps with grep to filter processes.",
      additionalHint:
        "The full command uses ps aux to list all processes and pipes the output to grep.",
      solution: "ps aux | grep chrome",
      difficulty: "intermediate",
    },
    {
      id: "mac_6",
      title: "App Launcher",
      description: "Open the Calculator application from the terminal.",
      hint: "macOS has a command to open applications.",
      additionalHint: "Use open -a followed by the application name.",
      solution: "open -a Calculator",
      difficulty: "beginner",
    },
    {
      id: "mac_7",
      title: "Directory Builder",
      description:
        "Create a nested directory structure: parent/child/grandchild in one command.",
      hint: "mkdir has a flag to create parent directories.",
      additionalHint:
        "The -p flag allows mkdir to create parent directories as needed.",
      solution: "mkdir -p parent/child/grandchild",
      difficulty: "beginner",
    },
    {
      id: "mac_8",
      title: "Talking Terminal",
      description: 'Make your computer say "Hello, Terminal Commander!"',
      hint: "There's a command that converts text to speech.",
      additionalHint: "The say command converts text to speech.",
      solution: 'say "Hello, Terminal Commander!"',
      difficulty: "beginner",
    },
    {
      id: "mac_9",
      title: "Screenshot Taker",
      description:
        "Take a screenshot of the entire screen and save it to the desktop.",
      hint: "macOS has a built-in command for taking screenshots.",
      additionalHint:
        "The screencapture command with -x flag captures the screen silently.",
      solution: "screencapture -x ~/Desktop/screenshot.png",
      difficulty: "intermediate",
    },
    {
      id: "mac_10",
      title: "Clipboard Manipulator",
      description:
        'Copy the contents of a file named "notes.txt" to the clipboard.',
      hint: "macOS has a command for copying to the clipboard.",
      additionalHint: "Use cat to output the file and pipe it to pbcopy.",
      solution: "cat notes.txt | pbcopy",
      difficulty: "intermediate",
    },
    {
      id: "mac_11",
      title: "System Sleeper",
      description: "Prevent your Mac from sleeping for 1 hour.",
      hint: "There's a command that prevents system sleep.",
      additionalHint:
        "The caffeinate command with -t flag specifies duration in seconds.",
      solution: "caffeinate -t 3600",
      difficulty: "intermediate",
    },
    {
      id: "mac_12",
      title: "Dock Customizer",
      description: "Add a spacer to the Dock using the terminal.",
      hint: "Use the defaults command to modify the Dock.",
      additionalHint:
        "The command uses defaults write with com.apple.dock and persistent-apps.",
      solution:
        'defaults write com.apple.dock persistent-apps -array-add \'{"tile-type"="spacer-tile";}\'; killall Dock',
      difficulty: "advanced",
    },
  ],
};

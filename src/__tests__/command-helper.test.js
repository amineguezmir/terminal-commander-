import { explainCommand } from "../features/command-helper.js";

// Mock dependencies
jest.mock("../data/commands.js", () => ({
  commands: {
    linux: [
      {
        name: "ls",
        aliases: ["dir", "list"],
        description: "Lists files and directories.",
        usage: "ls [options]",
        examples: ["ls", "ls -la"],
        tip: "Use ls -la to see hidden files.",
      },
    ],
  },
}));

// Mock config
const mockConfig = {
  get: jest.fn(),
  set: jest.fn(),
};

// Mock console.log
console.log = jest.fn();

describe("Command Helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock values
    mockConfig.get.mockImplementation((key) => {
      if (key === "commandHistory") return [];
      if (key === "settings") return { colorTheme: "default" };
      return null;
    });
  });

  it("should explain a command", () => {
    const result = explainCommand("ls", "linux", mockConfig);

    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalled();
  });

  it("should explain a command by alias", () => {
    const result = explainCommand("dir", "linux", mockConfig);

    expect(result).toBe(true);
    expect(console.log).toHaveBeenCalled();
  });

  it("should track command in history if new", () => {
    explainCommand("ls", "linux", mockConfig);

    expect(mockConfig.get).toHaveBeenCalledWith("commandHistory");
    expect(mockConfig.set).toHaveBeenCalledWith("commandHistory", ["ls"]);
  });

  it("should not track command in history if already learned", () => {
    // Mock command already in history
    mockConfig.get.mockImplementation((key) => {
      if (key === "commandHistory") return ["ls"];
      if (key === "settings") return { colorTheme: "default" };
      return null;
    });

    explainCommand("ls", "linux", mockConfig);

    expect(mockConfig.set).not.toHaveBeenCalledWith(
      "commandHistory",
      expect.anything()
    );
  });

  it("should return false for unknown commands", () => {
    const result = explainCommand("unknown", "linux", mockConfig);

    expect(result).toBe(false);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("not found")
    );
  });

  it("should handle errors gracefully", () => {
    // Force an error
    mockConfig.get.mockImplementation(() => {
      throw new Error("Test error");
    });

    const result = explainCommand("ls", "linux", mockConfig);

    expect(result).toBe(false);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining("Error"));
  });
});

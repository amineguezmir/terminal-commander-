import { awardXP, awardBadge } from "../features/rewards.js";

// Mock the config store
const mockConfig = {
  get: jest.fn(),
  set: jest.fn(),
};

// Mock console.log to prevent test output pollution
console.log = jest.fn();

describe("Rewards System", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default mock values
    mockConfig.get.mockImplementation((key) => {
      if (key === "xp") return 50;
      if (key === "level") return 1;
      if (key === "badges") return ["Existing Badge"];
      return null;
    });
  });

  describe("awardXP", () => {
    it("should add XP to the user", () => {
      const result = awardXP(10, mockConfig);

      expect(mockConfig.get).toHaveBeenCalledWith("xp");
      expect(mockConfig.get).toHaveBeenCalledWith("level");
      expect(mockConfig.set).toHaveBeenCalledWith("xp", 60);
      expect(result.xp).toBe(60);
      expect(result.level).toBe(1);
    });

    it("should level up when XP threshold is reached", () => {
      // Mock XP close to level threshold
      mockConfig.get.mockImplementation((key) => {
        if (key === "xp") return 95;
        if (key === "level") return 1;
        if (key === "badges") return ["Existing Badge"];
        return null;
      });

      const result = awardXP(10, mockConfig);

      expect(mockConfig.set).toHaveBeenCalledWith("level", 2);
      expect(result.level).toBe(2);
    });

    it("should handle errors gracefully", () => {
      // Force an error
      mockConfig.get.mockImplementation(() => {
        throw new Error("Test error");
      });

      const result = awardXP(10, mockConfig);

      // Should return default values on error
      expect(result.xp).toBe(undefined);
      expect(result.level).toBe(undefined);
    });
  });

  describe("awardBadge", () => {
    it("should add a new badge to the user", () => {
      const result = awardBadge("New Badge", mockConfig);

      expect(mockConfig.get).toHaveBeenCalledWith("badges");
      expect(mockConfig.set).toHaveBeenCalledWith("badges", [
        "Existing Badge",
        "New Badge",
      ]);
      expect(result).toBe(true);
    });

    it("should not add a badge the user already has", () => {
      const result = awardBadge("Existing Badge", mockConfig);

      expect(mockConfig.set).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it("should handle errors gracefully", () => {
      // Force an error
      mockConfig.get.mockImplementation(() => {
        throw new Error("Test error");
      });

      const result = awardBadge("New Badge", mockConfig);

      // Should return false on error
      expect(result).toBe(false);
    });
  });
});

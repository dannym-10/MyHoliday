import { generateBankHolidayID } from "./generateBankHolidayID";

describe("generateBankHolidayID", () => {
  it("should generate a valid ID from a single-word title and date", () => {
    expect(generateBankHolidayID("Christmas", "2024-12-25")).toBe(
      "christmas-2024-12-25",
    );
  });

  it("should replace spaces with hyphens", () => {
    expect(generateBankHolidayID("Boxing Day", "2024-12-26")).toBe(
      "boxing-day-2024-12-26",
    );
  });

  it("should convert title to lowercase", () => {
    expect(generateBankHolidayID("GOOD FRIDAY", "2024-03-29")).toBe(
      "good-friday-2024-03-29",
    );
  });

  it("should handle titles with multiple spaces", () => {
    expect(generateBankHolidayID("New Year Day", "2024-01-01")).toBe(
      "new-year-day-2024-01-01",
    );
  });
});

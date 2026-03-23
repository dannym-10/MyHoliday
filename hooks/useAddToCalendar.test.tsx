import { renderHook } from "@testing-library/react-native";
import { Alert, Platform } from "react-native";
import * as Calendar from "expo-calendar";
import { useAddToCalendar } from "./useAddToCalendar";

jest.mock("expo-calendar");

const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});

const mockUseCalendarPermissions = Calendar.useCalendarPermissions as jest.Mock;
const mockGetDefaultCalendarAsync =
  Calendar.getDefaultCalendarAsync as jest.Mock;
const mockCreateEventAsync = Calendar.createEventAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useAddToCalendar", () => {
  test("alerts user if permission is denied", async () => {
    mockUseCalendarPermissions.mockReturnValue([
      { granted: false },
      jest.fn().mockResolvedValue({ granted: false }),
    ]);

    const { result } = renderHook(() => useAddToCalendar());

    await result.current.addToCalendar("My Event", "2026-01-01");

    expect(alertSpy).toHaveBeenCalledWith(
      "Calendar Access is Required",
      "Please enable calendar permissions in your device settings to add an event to your calendar",
      [{ text: "Ok" }],
    );
    expect(mockCreateEventAsync).not.toHaveBeenCalled();
  });

  test("uses getDefaultCalendarAsync and creates calendar event", async () => {
    Platform.OS = "ios";

    mockUseCalendarPermissions.mockReturnValue([{ granted: true }, jest.fn()]);

    mockGetDefaultCalendarAsync.mockResolvedValue({ id: "default-ios" });
    mockCreateEventAsync.mockResolvedValue("event-id");

    const { result } = renderHook(() => useAddToCalendar());
    await result.current.addToCalendar("iOS Event", "2026-01-01");

    expect(mockGetDefaultCalendarAsync).toHaveBeenCalled();
    expect(mockCreateEventAsync).toHaveBeenCalledWith(
      "default-ios",
      expect.any(Object),
    );
    expect(alertSpy).toHaveBeenCalledWith(
      "iOS Event has been added to your calendar",
    );
  });
});

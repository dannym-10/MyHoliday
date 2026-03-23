import { render, fireEvent, screen } from "@testing-library/react-native";
import HolidayDetailScreen from "./[id]";
import { useAddToCalendar } from "@/hooks/useAddToCalendar";
import { useEditContext } from "@/context/EditContext";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";

jest.mock("@/hooks/useAddToCalendar");
jest.mock("@/context/EditContext");
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
  router: { back: jest.fn(), push: jest.fn() },
}));
jest.mock("@/components/ConfirmationModal", () => ({
  ConfirmationModal: ({ isVisible }: { isVisible: boolean }) => {
    const { View } = require("react-native");
    const React = require("react");
    return isVisible
      ? React.createElement(View, { testID: "confirmation-modal" })
      : null;
  },
}));
jest.mock("react-native-modal-datetime-picker", () => () => null);

const mockAddToCalendar = jest.fn();
const mockUpdateItem = jest.fn();

const mockParams = {
  id: "1",
  title: "Mock Bank Holiday",
  date: "2026-01-01",
  isInEditMode: "false",
};

beforeEach(() => {
  jest.clearAllMocks();
  (useAddToCalendar as jest.Mock).mockReturnValue({
    addToCalendar: mockAddToCalendar,
  });
  (useEditContext as jest.Mock).mockReturnValue({
    editedItems: {},
    updateItem: mockUpdateItem,
  });
  (useLocalSearchParams as jest.Mock).mockReturnValue(mockParams);
});

test("when screen renders, correct information is shown", () => {
  render(<HolidayDetailScreen />);

  expect(screen.getByText(mockParams.title)).toBeTruthy();
  expect(
    screen.getByText(format(mockParams.date, "EEEE d MMMM yyyy")),
  ).toBeTruthy();
  expect(screen.getByText("Add to Calendar")).toBeTruthy();
});

test("when Edit details is pressed, edit form is shown with save changes button", () => {
  render(<HolidayDetailScreen />);

  fireEvent.press(screen.getByText("Edit details"));
  expect(screen.getByPlaceholderText("Holiday title")).toBeTruthy();
  expect(screen.getByText("Save Changes")).toBeTruthy();
});

test("when save changes is pressed, confirmation modal is shown", () => {
  render(<HolidayDetailScreen />);

  fireEvent.press(screen.getByText("Edit details"));
  fireEvent.press(screen.getByText("Save Changes"));
  expect(screen.getByTestId("confirmation-modal")).toBeTruthy();
});

test("when cancel is pressed after editing title, original title is shown", () => {
  render(<HolidayDetailScreen />);

  fireEvent.press(screen.getByText("Edit details"));
  fireEvent.changeText(
    screen.getByPlaceholderText("Holiday title"),
    "Changed Title",
  );
  fireEvent.press(screen.getByText("Cancel"));
  expect(screen.getByText(mockParams.title)).toBeTruthy();
  expect(screen.queryByPlaceholderText("Holiday title")).toBeNull();
});

test("when navigating to screen with isInEditMode true, edit form is shown", () => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    ...mockParams,
    isInEditMode: "true",
  });

  render(<HolidayDetailScreen />);

  expect(screen.getByPlaceholderText("Holiday title")).toBeTruthy();
  expect(screen.getByText("Save Changes")).toBeTruthy();
});

test("when add to calendar is pressed, addToCalendar is called with correct params", () => {
  render(<HolidayDetailScreen />);

  fireEvent.press(screen.getByText("Add to Calendar"));
  expect(mockAddToCalendar).toHaveBeenCalledWith(
    mockParams.title,
    mockParams.date,
  );
});

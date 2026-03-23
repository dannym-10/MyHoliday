jest.mock("react-native-gesture-handler/ReanimatedSwipeable", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { ListItem } from "./ListItem";
import { router } from "expo-router";
import { differenceInDays } from "date-fns";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

const mockProps = {
  title: "Good Friday",
  date: "2028-04-18",
  id: "good-friday-2025-04-18",
  currentlyOpenSwipeableRef: { current: null },
};

describe("ListItem", () => {
  it("should format the date correctly", () => {
    render(<ListItem {...mockProps} />);

    expect(screen.getByText("18")).toBeTruthy();
    expect(screen.getByText("Apr")).toBeTruthy();
  });

  it("should display the correct number of days until the event", () => {
    render(<ListItem {...mockProps} />);

    const daysUntil = differenceInDays(mockProps.date, new Date());
    const label = daysUntil === 1 ? "day" : "days";

    expect(screen.getByText(`In ${daysUntil} ${label}`)).toBeTruthy();
  });

  it("should call router.push with the correct params when pressed", () => {
    render(<ListItem {...mockProps} />);

    fireEvent.press(screen.getByText(mockProps.title));

    expect(router.push).toHaveBeenCalledWith({
      pathname: "/holiday/[id]",
      params: {
        id: mockProps.id,
        title: mockProps.title,
        date: mockProps.date,
        isInEditMode: "false",
      },
    });
  });
});

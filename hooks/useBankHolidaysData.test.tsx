import axios from "axios";
import { useBankHolidaysData } from "./useBankHolidaysData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  generateMockEvent,
  mockBankHolidaysResponse,
} from "@/mockData/generateMockBankHolidayData";
import { renderHook, waitFor } from "@testing-library/react-native";
import { addMonths, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { faker } from "@faker-js/faker";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  jest.useFakeTimers().setSystemTime(new Date("2026-01-01"));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("useBankHolidaysData", () => {
  test("tests hook to make sure data is returned correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBankHolidaysResponse });

    const { result } = renderHook(() => useBankHolidaysData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const bankHolidayData = result.current.data!;
    const today = startOfDay(new Date());
    const sixMonthsFromToday = addMonths(today, 6);

    expect(bankHolidayData?.length).toBeLessThanOrEqual(5);

    const uniqueKeys = new Set(
      bankHolidayData.map((bhd) => `${bhd.date}-${bhd.title}`),
    );
    expect(uniqueKeys.size).toBe(bankHolidayData.length);

    bankHolidayData.forEach((item) => {
      const date = parseISO(item.date);

      expect(isBefore(date, today)).toBe(false);
      expect(isAfter(date, sixMonthsFromToday)).toBe(false);
    });
  });

  test("removes duplicate events that are in multiple regions", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockBankHolidaysResponse });

    const { result } = renderHook(() => useBankHolidaysData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const bankHolidayData = result.current.data!;

    const duplicates = bankHolidayData.filter(
      (bhd) => bhd.title === "Duplicate Event",
    );

    expect(duplicates.length).toBeLessThanOrEqual(1);
  });

  test("handles error state", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useBankHolidaysData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  test("handles empty state when all data is in the past or post 6 months", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        "england-and-wales": {
          events: [
            {
              title: "past event",
              date: "2020-01-01",
              bunting: false,
              notes: "",
            },
          ],
        },
        scotland: {
          events: [
            {
              title: "future event",
              date: "2030-01-01",
              bunting: false,
              notes: "",
            },
          ],
        },
        "northern-ireland": { events: [] },
      },
    });

    const { result } = renderHook(() => useBankHolidaysData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });
});

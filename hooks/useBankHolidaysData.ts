import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addMonths, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { generateBankHolidayID } from "../utils/generateBankHolidayID";

export interface BankHolidayItemResponse {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
}

export interface BankHolidayItem extends Pick<
  BankHolidayItemResponse,
  "title" | "date"
> {
  id: string;
}

export interface BankHolidayResponse {
  "england-and-wales": { events: BankHolidayItemResponse[] };
  scotland: { events: BankHolidayItemResponse[] };
  "northern-ireland": { events: BankHolidayItemResponse[] };
}

const fetchBankHolidaysData = async (): Promise<BankHolidayResponse> => {
  const response = await axios.get("https://www.gov.uk/bank-holidays.json");
  return response.data;
};

export const useBankHolidaysData = () => {
  return useQuery<BankHolidayResponse, Error, BankHolidayItem[]>({
    queryFn: fetchBankHolidaysData,
    queryKey: ["BankHolidays"],
    select: (data) => {
      const allData: BankHolidayItem[] = [
        ...data["england-and-wales"].events,
        ...data["scotland"].events,
        ...data["northern-ireland"].events,
      ].map((item) => ({
        title: item.title,
        date: item.date,
        id: generateBankHolidayID(item.title, item.date),
      }));

      const uniqueData = Array.from(
        new Map(
          allData.map((item) => [`${item.date}-${item.title}`, item]),
        ).values(),
      );

      const today = startOfDay(new Date());
      const sixMonthsFromToday = addMonths(today, 6);

      return uniqueData
        .filter((item) => {
          const date = parseISO(item.date);
          return !isBefore(date, today) && !isAfter(date, sixMonthsFromToday);
        })
        .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
        .slice(0, 5);
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { addMonths, isAfter, isBefore, parseISO, startOfDay } from "date-fns";

// Bank Holiday List Screen — Display the next 5 UK bank holidays occurring within the next 6 months,
// The feed contains separate lists for England and Wales, Scotland, and Northern Ireland. Merge all three
// lists and deduplicate by date and title, then display the next 5 unique holidays within the 6-month window.

interface BankHoliday {
  title: string;
  date: string;
  notes: string;
  bunting: boolean;
}

interface BankHolidayResponse {
  "england-and-wales": { events: BankHoliday[] };
  scotland: { events: BankHoliday[] };
  "northern-ireland": { events: BankHoliday[] };
}

const fetchBankHolidaysData = async (): Promise<BankHolidayResponse> => {
  const response = await axios.get("https://www.gov.uk/bank-holidays.json");
  return response.data;
};

export const useBankHolidaysData = () => {
  return useQuery({
    queryFn: fetchBankHolidaysData,
    queryKey: ["BankHolidays"],
    select: (data) => {
      const allData = [
        ...data["england-and-wales"].events,
        ...data["scotland"].events,
        ...data["northern-ireland"].events,
      ].map((item) => ({
        title: item.title,
        date: item.date,
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

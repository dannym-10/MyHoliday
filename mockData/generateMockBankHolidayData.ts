import {
  BankHolidayItemResponse,
  BankHolidayResponse,
} from "@/hooks/useBankHolidaysData";
import { faker } from "@faker-js/faker";
import { format } from "date-fns";

export const generateMockEvent = (
  timeframe: "past" | "within6Months" | "beyond6Months",
) => {
  let date: Date;

  switch (timeframe) {
    case "past":
      date = faker.date.past();
      break;
    case "within6Months":
      date = faker.date.soon({ days: 180 });
      break;
    case "beyond6Months":
      date = faker.date.future({ years: 1 });
      break;
  }

  return {
    title: faker.word.words({ count: 4 }),
    date: format(date, "yyyy-MM-dd"),
    bunting: faker.datatype.boolean(),
    notes: "",
  };
};

const duplicateEvent: BankHolidayItemResponse = {
  title: "Duplicate Event",
  date: format(faker.date.soon({ days: 30 }), "yyyy-MM-dd"),
  notes: "",
  bunting: false,
};

export const mockBankHolidaysResponse: BankHolidayResponse = {
  "england-and-wales": {
    events: [
      generateMockEvent("past"),
      duplicateEvent,
      generateMockEvent("within6Months"),
      generateMockEvent("within6Months"),
      generateMockEvent("beyond6Months"),
      generateMockEvent("beyond6Months"),
    ],
  },
  "northern-ireland": {
    events: [
      duplicateEvent,
      generateMockEvent("within6Months"),
      generateMockEvent("within6Months"),
      generateMockEvent("beyond6Months"),
      generateMockEvent("beyond6Months"),
    ],
  },
  scotland: {
    events: [
      duplicateEvent,
      generateMockEvent("past"),
      generateMockEvent("within6Months"),
      generateMockEvent("within6Months"),
      generateMockEvent("within6Months"),
      generateMockEvent("within6Months"),
      generateMockEvent("beyond6Months"),
    ],
  },
};

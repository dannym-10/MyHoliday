export const generateBankHolidayID = (title: string, date: string) => {
  return `${title.split(" ").join("-").toLocaleLowerCase()}-${date}`;
};

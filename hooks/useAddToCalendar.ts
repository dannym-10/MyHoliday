import { endOfDay, parseISO } from "date-fns";
import * as Calendar from "expo-calendar";
import { Alert, Platform } from "react-native";

export const useAddToCalendar = () => {
  const [status, requestPermission] = Calendar.useCalendarPermissions();

  const addToCalendar = async (title: string, date: string) => {
    if (!status?.granted) {
      const { granted } = await requestPermission();

      if (!granted) {
        Alert.alert(
          "Calendar Access is Required",
          "Please enable calendar permissions in your device settings to add an event to your calendar",
          [{ text: "Ok" }],
        );
        return;
      }
    }

    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT,
    );

    const calendar =
      Platform.OS === "ios"
        ? await Calendar.getDefaultCalendarAsync()
        : (calendars.find((c) => c.isPrimary) ?? calendars[0]);

    const startDate = parseISO(date);
    const endDate = endOfDay(startDate);

    await Calendar.createEventAsync(calendar.id, {
      title,
      allDay: true,
      startDate,
      endDate,
    });

    Alert.alert(`${title} has been added to your calendar`);
  };

  return { addToCalendar };
};

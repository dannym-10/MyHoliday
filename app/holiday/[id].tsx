import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { differenceInDays, format, formatDate } from "date-fns";
import { useAddToCalendar } from "@/hooks/useAddToCalendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight } from "@/assets/SVGs/ChevronRight";
import { router } from "expo-router";
import { useState } from "react";

export default function HolidayDetailScreen() {
  const { id, title, date } = useLocalSearchParams<{
    id: string;
    title: string;
    date: string;
  }>();
  const [currentTitle, setCurrentTitle] = useState<string>(title);
  const [currentDate, setCurrentDate] = useState<string>(date);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { addToCalendar } = useAddToCalendar();
  const daysUntil = differenceInDays(date, new Date());
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.screenWrapper, { paddingTop: top }]}>
      <View style={styles.headingContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ChevronRight
            color="#1D9E75"
            height={20}
            width={20}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
          <Text style={styles.greenText}>Back</Text>
        </Pressable>
        {isEditMode ? (
          <Pressable onPress={() => setIsEditMode(false)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setIsEditMode(true)}>
            <Text style={styles.greenText}>Edit details</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.topWrapper}>
        <Text style={styles.bankHolidayText}>BANK HOLIDAY</Text>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.dateText}>
          {formatDate(date, "EEEE d MMMM yyyy")}
        </Text>
      </View>
      <View style={styles.middleWrapper}>
        <View>
          <Text style={styles.middleHeading}>Days away</Text>
          <Text style={styles.middleText}>
            {daysUntil} {daysUntil === 1 ? "day" : "days"}
          </Text>
        </View>
        <View style={styles.spacer} />
        <View>
          <Text style={styles.middleHeading}>Falls on</Text>
          <Text style={styles.middleText}>{format(date, "EEEE")}</Text>
        </View>
      </View>
      <Pressable
        style={styles.buttonWrapper}
        onPress={() =>
          isEditMode
            ? console.log("saving changes")
            : addToCalendar(title, date)
        }
      >
        <Text style={styles.buttonText}>
          {isEditMode ? "Save Changes" : "Add to Calendar"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    paddingHorizontal: 24,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  greenText: {
    color: "#1D9E75",
    fontSize: 18,
  },
  cancelButton: {
    color: "#E24B4A",
    fontSize: 18,
  },
  topWrapper: {
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: "#0F6E56",
    borderRadius: 14,
    marginBottom: 20,
  },
  bankHolidayText: {
    fontSize: 14,
    marginBottom: 12,
    color: "#FFF",
  },
  titleText: {
    fontSize: 32,
    marginBottom: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  dateText: {
    fontSize: 18,
    color: "#FFF",
  },
  middleWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F0FBF7",
    borderWidth: 1,
    borderColor: "#1D9E75",
    borderRadius: 14,
    padding: 20,
  },
  middleHeading: {
    fontSize: 14,
    color: "#888780",
    paddingBottom: 4,
  },
  middleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C2C2A",
  },
  spacer: {
    height: 40,
    width: 1,
    backgroundColor: "#888780",
  },
  buttonWrapper: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: "#1D9E75",
    borderRadius: 14,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#FFF",
    fontWeight: "600",
  },
});

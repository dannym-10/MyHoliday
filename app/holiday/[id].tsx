import { useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { addMonths, differenceInDays, format, formatDate } from "date-fns";
import { useAddToCalendar } from "@/hooks/useAddToCalendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight } from "@/assets/SVGs/ChevronRight";
import { router } from "expo-router";
import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useEditContext } from "@/context/EditContext";
import { ConfirmationModal } from "@/components/ConfirmationModal";

export default function HolidayDetailScreen() {
  const { id, title, date } = useLocalSearchParams<{
    id: string;
    title: string;
    date: string;
  }>();
  const { top } = useSafeAreaInsets();
  const { addToCalendar } = useAddToCalendar();
  const { editedItems, updateItem } = useEditContext();
  const currentItem = editedItems[id] || { title, date };
  const [currentTitle, setCurrentTitle] = useState<string>(currentItem.title);
  const [stagedTitle, setStagedTitle] = useState<string>(currentItem.title);
  const [currentDate, setCurrentDate] = useState<string>(currentItem.date);
  const [stagedDate, setStagedDate] = useState<string>(currentItem.date);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const daysUntil = differenceInDays(new Date(currentDate), new Date());

  const handleDateConfirm = (selectedDate: Date) => {
    setStagedDate(format(selectedDate, "yyyy-MM-dd"));
    setIsDatePickerVisible(false);
  };

  const handleUpdateItem = () => {
    setCurrentTitle(stagedTitle);
    setCurrentDate(stagedDate);

    updateItem(id, {
      title: stagedTitle,
      date: stagedDate,
    });

    setIsEditMode(false);
    setIsConfirmationModalVisible(false);
  };

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
          <Pressable
            onPress={() => {
              setIsEditMode(false);
              setStagedTitle(currentTitle);
              setStagedDate(currentDate);
            }}
          >
            <Text style={styles.cancelButton}>Cancel</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => setIsEditMode(true)}>
            <Text style={styles.greenText}>Edit details</Text>
          </Pressable>
        )}
      </View>
      <Animated.View style={styles.topWrapper} layout={LinearTransition}>
        {isEditMode ? (
          <Animated.View key="main" entering={FadeIn} exiting={FadeOut}>
            <Text style={styles.editLabel}>Title</Text>
            <TextInput
              style={styles.editInput}
              value={stagedTitle}
              onChangeText={setStagedTitle}
              placeholder="Holiday title"
              placeholderTextColor="rgba(255,255,255,0.4)"
            />
            <Text style={styles.editLabel}>Date</Text>
            <Pressable onPress={() => setIsDatePickerVisible(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={styles.editInput}
                  value={format(stagedDate, "dd/MM/yyyy")}
                  editable={false}
                />
              </View>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View key="editing" entering={FadeIn} exiting={FadeOut}>
            <Text style={styles.bankHolidayText}>BANK HOLIDAY</Text>
            <Text style={styles.titleText}>{currentTitle}</Text>
            <Text style={styles.dateText}>
              {formatDate(currentDate, "EEEE d MMMM yyyy")}
            </Text>
          </Animated.View>
        )}
      </Animated.View>
      <Animated.View layout={LinearTransition}>
        <View style={[styles.middleWrapper, isEditMode && { opacity: 0.4 }]}>
          <View>
            <Text style={styles.middleHeading}>Days away</Text>
            <Text style={styles.middleText}>
              {daysUntil} {daysUntil === 1 ? "day" : "days"}
            </Text>
          </View>
          <View style={styles.spacer} />
          <View>
            <Text style={styles.middleHeading}>Falls on</Text>
            <Text style={styles.middleText}>{format(currentDate, "EEEE")}</Text>
          </View>
        </View>
        <Pressable
          style={styles.buttonWrapper}
          onPress={() =>
            isEditMode
              ? setIsConfirmationModalVisible(true)
              : addToCalendar(currentTitle, currentDate)
          }
        >
          <Text style={styles.buttonText}>
            {isEditMode ? "Save Changes" : "Add to Calendar"}
          </Text>
        </Pressable>
      </Animated.View>
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={() => setIsConfirmationModalVisible(false)}
        onConfirm={handleUpdateItem}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date(stagedDate)}
        onConfirm={handleDateConfirm}
        onCancel={() => setIsDatePickerVisible(false)}
        minimumDate={new Date()}
        maximumDate={addMonths(new Date(), 6)}
      />
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
    minHeight: 140,
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
  editLabel: {
    fontSize: 14,
    color: "#9FE1CB",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: "#F0FBF7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 10,
    color: "#2C2C2A",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 14,
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

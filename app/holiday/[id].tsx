import { useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { differenceInDays, format, formatDate } from "date-fns";
import { useAddToCalendar } from "@/hooks/useAddToCalendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight } from "@/assets/SVGs/ChevronRight";
import { router } from "expo-router";

export default function HolidayDetailScreen() {
  const { id, title, date } = useLocalSearchParams<{
    id: string;
    title: string;
    date: string;
  }>();
  const { addToCalendar } = useAddToCalendar();
  const daysUntil = differenceInDays(date, new Date());
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: top,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 30,
          paddingTop: 10,
        }}
      >
        <Pressable
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => router.back()}
        >
          <ChevronRight
            color="#1D9E75"
            height={20}
            width={20}
            style={{ transform: [{ rotate: "180deg" }] }}
          />
          <Text style={{ color: "#1D9E75", fontSize: 18 }}>Back</Text>
        </Pressable>
        <Pressable>
          <Text style={{ color: "#1D9E75", fontSize: 18 }}>Edit details</Text>
        </Pressable>
      </View>
      <View
        style={{
          paddingHorizontal: 28,
          paddingVertical: 24,
          backgroundColor: "#0F6E56",
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 14, marginBottom: 12, color: "#FFF" }}>
          BANK HOLIDAY
        </Text>
        <Text
          style={{
            fontSize: 32,
            marginBottom: 16,
            fontWeight: "600",
            color: "#FFF",
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 18, color: "#FFF" }}>
          {formatDate(date, "EEEE d MMMM yyyy")}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#F0FBF7",
          borderWidth: 1,
          borderColor: "#1D9E75",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 14, color: "#888780", paddingBottom: 4 }}>
            Days away
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#2C2C2A" }}>
            {daysUntil} {daysUntil === 1 ? "day" : "days"}
          </Text>
        </View>
        <View style={{ height: 40, width: 1, backgroundColor: "#888780" }} />
        <View>
          <Text style={{ fontSize: 14, color: "#888780", paddingBottom: 4 }}>
            Falls on
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#2C2C2A" }}>
            {format(date, "EEEE")}
          </Text>
        </View>
      </View>
      <Pressable
        style={{
          marginTop: 20,
          paddingHorizontal: 10,
          paddingVertical: 16,
          backgroundColor: "#1D9E75",
          borderRadius: 14,
        }}
        onPress={() => addToCalendar(title, date)}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            color: "#FFF",
            fontWeight: "600",
          }}
        >
          Add to Calendar
        </Text>
      </Pressable>
    </View>
  );
}

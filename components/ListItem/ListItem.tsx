import React from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { differenceInDays, format } from "date-fns";
import { router } from "expo-router";
import { ChevronRight } from "@/assets/SVGs/ChevronRight";

interface ListItemProps {
  title: string;
  date: string;
  id: string;
}

export const ListItem: React.FC<ListItemProps> = ({ title, date, id }) => {
  const formattedDay = format(date, "dd");
  const formattedMonth = format(date, "MMM");
  const daysUntil = differenceInDays(date, new Date());

  const handlePress = () => {
    router.push({
      pathname: "/holiday/[id]",
      params: { id: id, title: title, date: date },
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.leftSide}>
          <View style={styles.dateWrapper}>
            <Text style={styles.day}>{formattedDay}</Text>
            <Text style={styles.month}>{formattedMonth}</Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.daysUntil}>
              In {daysUntil} {daysUntil === 1 ? "day" : "days"}
            </Text>
          </View>
        </View>
        <View style={styles.rightSide}>
          <ChevronRight color="#B4B2A9" width={24} height={24} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#1D9E75",
    borderRadius: 16,
    backgroundColor: "#F0FBF7",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSide: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  rightSide: {
    justifyContent: "center",
  },
  dateWrapper: {
    marginRight: 20,
    backgroundColor: "#9FE1CB",
    borderRadius: 8,
    padding: 4,
    width: 55,
    justifyContent: "center",
    alignContent: "center",
  },
  day: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    color: "#0F6E56",
    backgroundColor: "transparent",
  },
  month: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    color: "#0F6E56",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2C2C2A",
  },
  daysUntil: {
    paddingTop: 2,
    color: "#888780",
    fontSize: 14,
  },
});

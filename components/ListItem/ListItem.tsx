import React, { useRef } from "react";
import { StyleSheet, Pressable, Text, View } from "react-native";
import { differenceInDays, format } from "date-fns";
import { router } from "expo-router";
import { ChevronRight } from "@/assets/SVGs/ChevronRight";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { TrashIcon } from "@/assets/SVGs/BinIcon";

interface ListItemProps {
  title: string;
  date: string;
  id: string;
  currentlyOpenSwipeableRef: { current: SwipeableMethods | null };
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  date,
  id,
  currentlyOpenSwipeableRef,
}) => {
  const formattedDay = format(date, "dd");
  const formattedMonth = format(date, "MMM");
  const daysUntil = differenceInDays(date, new Date());

  const swipeableRef = useRef<SwipeableMethods>(null);

  const handlePress = (isEditMode: boolean) => {
    router.push({
      pathname: "/holiday/[id]",
      params: {
        id: id,
        title: title,
        date: date,
        isInEditMode: String(isEditMode),
      },
    });
  };

  const renderRightAction = () => {
    return (
      <Pressable
        onPress={() => handlePress(true)}
        style={{
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 4,
          width: 60,
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <TrashIcon height={30} width={30} color="white" />
      </Pressable>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightAction}
      containerStyle={styles.swipeableContainer}
      onSwipeableWillOpen={() => {
        if (currentlyOpenSwipeableRef.current !== swipeableRef.current) {
          currentlyOpenSwipeableRef.current?.close();
        }
        currentlyOpenSwipeableRef.current = swipeableRef.current;
      }}
    >
      <Pressable onPress={() => handlePress(false)}>
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
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1D9E75",
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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

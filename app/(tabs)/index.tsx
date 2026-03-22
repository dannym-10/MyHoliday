import React, { useCallback, useRef } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  BankHolidayItem,
  useBankHolidaysData,
} from "../../hooks/useBankHolidaysData";
import { ListItem } from "@/components/ListItem/ListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SwipeableMethods } from "react-native-gesture-handler/lib/typescript/components/ReanimatedSwipeable";
import Animated, {
  FadeInLeft,
  LinearTransition,
} from "react-native-reanimated";
import { useEditContext } from "@/context/EditContext";
import { useFocusEffect } from "expo-router";

export default function TabOneScreen() {
  const { top } = useSafeAreaInsets();
  const { data, isLoading, isError, refetch, isFetching } =
    useBankHolidaysData();
  const { editedItems } = useEditContext();

  const mergedData: BankHolidayItem[] =
    data?.map((item) => ({
      ...item,
      ...(editedItems[item.id] || {}),
    })) || [];

  const currentlyOpenSwipeableRef = useRef<SwipeableMethods | null>(null);

  useFocusEffect(
    useCallback(() => {
      currentlyOpenSwipeableRef.current?.close();
      currentlyOpenSwipeableRef.current = null;
    }, []),
  );

  if (isLoading) {
    return (
      <View
        style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{ alignContent: "center", justifyContent: "center", flex: 1 }}
      >
        <Text style={{ textAlign: "center" }}>
          Something has gone wrong.
          <Pressable onPress={() => refetch()}>
            <Text>Please try again</Text>
          </Pressable>
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingTop: top,
        flex: 1,
        paddingHorizontal: 24,
        backgroundColor: "#F7F5F0",
      }}
    >
      <View style={styles.headingContainer}>
        <Text style={{ color: "#888780", fontSize: 14, marginBottom: 12 }}>
          ENGLAND, NORTHERN IRELAND{"\n"}SCOTLAND AND WALES
        </Text>
        <Text style={{ fontSize: 34, fontWeight: "500", color: "#2C2C2A" }}>
          Bank Holidays
        </Text>
      </View>
      <FlatList
        data={mergedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInLeft.delay(index * 100).duration(300)}
            layout={LinearTransition}
          >
            <ListItem
              date={item.date}
              title={item.title}
              id={item.id}
              key={item.id}
              currentlyOpenSwipeableRef={currentlyOpenSwipeableRef}
            />
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 12,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

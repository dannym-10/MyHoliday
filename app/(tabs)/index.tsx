import React from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useBankHolidaysData } from "../../hooks/useBankHolidaysData";
import { format } from "date-fns";
import { router } from "expo-router";

export default function TabOneScreen() {
  const { data, isLoading, isError, refetch, isFetching } =
    useBankHolidaysData();

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

  const renderItem = (item: { title: string; date: string; id: string }) => {
    const formattedDay = format(item.date, "dd");
    const formattedMonth = format(item.date, "MMMM");

    const handlePress = () => {
      router.push({
        pathname: "/holiday/[id]",
        params: { id: item.id, title: item.title, date: item.date },
      });
    };

    return (
      <Pressable onPress={handlePress}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 30,
            alignItems: "center",
          }}
        >
          <View style={{ paddingRight: 20 }}>
            <Text style={{ fontSize: 30, fontWeight: "700" }}>
              {formattedDay}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: "400" }}>
              {formattedMonth}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "400" }}>{item.title}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <Text style={{ fontSize: 24, textAlign: "center", fontWeight: "500" }}>
        Bank Holidays
      </Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 10,
          paddingTop: 20,
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: "red", marginHorizontal: 10 }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

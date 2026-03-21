import { useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";

export default function HolidayDetailScreen() {
  const { id, title, date } = useLocalSearchParams<{
    id: string;
    title: string;
    date: string;
  }>();

  return (
    <View>
      <Text>{title}</Text>
      <Button
        onPress={() => console.log("pressed button")}
        title="Add to Calendar"
      />
    </View>
  );
}

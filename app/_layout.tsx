import { Stack } from "expo-router";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: "#fff",
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: "PCA Mobile App",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2c3e50",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
});

// app/screens/AssetListHeader.tsx
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function AssetListHeader({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Home</Text>

      <TextInput
        style={styles.input}
        placeholder="Search FAM / Tag / Description"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 12 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
  },
});
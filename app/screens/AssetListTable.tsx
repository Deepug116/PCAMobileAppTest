// app/screens/AssetListTable.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Asset } from "./AssetService";

// Renders ONE row (the FlatList in the screen feeds it an item)
export default function AssetListTable({ item }: { item: Asset }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.fam]}>{item.fam ?? "-"}</Text>
      <Text style={[styles.cell, styles.tag]}>{item.tag ?? "-"}</Text>
      <Text style={[styles.cell, styles.desc]} numberOfLines={2}>
        {item.description?.trim() || "No description"}
      </Text>
    </View>
  );
}

export const TableHeader = () => (
  <View style={[styles.row, styles.head]}>
    <Text style={[styles.cell, styles.fam, styles.headText]}>FAM #</Text>
    <Text style={[styles.cell, styles.tag, styles.headText]}>TAG</Text>
    <Text style={[styles.cell, styles.desc, styles.headText]}>Description</Text>
  </View>
);

const styles = StyleSheet.create({
  head: { backgroundColor: "#f6f6f6" },
  headText: { fontWeight: "700" },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  cell: { paddingRight: 8 },
  fam: { width: 90 },
  tag: { width: 90 },
  desc: { flex: 1 },
});
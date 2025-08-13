// app/screens/AssetListScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AssetListHeader from "./AssetListHeader";
import AssetListTable, { TableHeader } from "./AssetListTable";
import { fetchAssets, type Asset } from "./AssetService";

export default function AssetListScreen() {
  const [items, setItems] = useState<Asset[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // load first page whenever query changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetchAssets(query, 1, 50);
        if (!cancelled) setItems(res.data || []);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? "Failed to fetch assets");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // tiny debounce so we don't hammer the API while typing
    const t = setTimeout(load, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  return (
    <View style={styles.container}>
      <AssetListHeader query={query} setQuery={setQuery} />

      {err ? <Text style={styles.err}>Error: {err}</Text> : null}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          ListHeaderComponent={TableHeader}
          renderItem={({ item }) => <AssetListTable item={item} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No results</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  err: { color: "#b00020", marginHorizontal: 12, marginBottom: 8 },
  empty: { padding: 16, color: "#666" },
});

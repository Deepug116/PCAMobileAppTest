import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';

// Change this to your Windows VM IP
const API = process.env.EXPO_PUBLIC_API_BASE || 'http://<YOUR-WINDOWS-IP>:3000';

export default function AssetListScreen() {
  const [assets, setAssets] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, page: '1', pageSize: '200' });
      const res = await fetch(`${API}/assets?${params.toString()}`);
      const data = await res.json();
      setAssets(data);
    } catch (err) {
      console.error('Error loading assets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const HeaderRow = () => (
    <View style={[styles.row, { backgroundColor: '#f4f5f7' }]}>
      <Text style={[styles.cell, styles.bold, { flex: 1 }]}>FAM #</Text>
      <Text style={[styles.cell, styles.bold, { flex: 1 }]}>TAG</Text>
      <Text style={[styles.cell, styles.bold, { flex: 2 }]}>Description</Text>
    </View>
  );

  const Row = ({ item }) => (
    <Pressable
      onPress={() => {
        // later: navigate to detail
      }}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? '#eef3ff' : 'white' },
      ]}
    >
      <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
        {item.fam ?? '-'}
      </Text>
      <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>
        {item.tag ?? '-'}
      </Text>
      <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>
        {item.description ?? '-'}
      </Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, padding: 12, gap: 10 }}>
      {/* Search bar */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search FAM / Tag / Description"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={load}
          style={styles.search}
        />
        <Pressable
          onPress={() => {
            // TODO: open filter modal
          }}
          style={styles.filterBtn}
        >
          <Text style={{ fontWeight: '600' }}>Filter</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator />}

      <FlatList
        data={assets}
        keyExtractor={(a) => String(a.id)}
        ListHeaderComponent={HeaderRow}
        renderItem={Row}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = {
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  cell: { paddingRight: 8 },
  bold: { fontWeight: '700' },
};

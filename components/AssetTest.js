// filepath: /Users/deepakguggilam/ReactNativeTutorial/app/screens/AssetTest.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function AssetTest() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://10.98.23.124:3000/assets')
      .then(response => setAssets(response.data))
      .catch(() => setError('Could not connect to backend'));
  }, []);
 return (
    <View>
      {error ? <Text>{error}</Text> : <Text>{JSON.stringify(assets)}</Text>}
    </View>
  );
}
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return ( 
  <Tabs screenOptions={{tabBarActiveTintColor : "coral"}}>
    <Tabs.Screen name = "index" options={{title: "Home", tabBarIcon: ({color}) => <FontAwesome name="home" size={24} color={color} />}} />
    <Tabs.Screen name = "loginscreen" options={{title: "Login"}} />
  </Tabs>
  );
}

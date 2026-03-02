import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Homescreen from "../screens/Homescreen";
import UserProfile from "../screens/UserProfile";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Homescreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
}

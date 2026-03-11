import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Homescreen from "../screens/Homescreen";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Homescreen} />
      {/* ✅ UserProfile is now a modal inside Homescreen, so remove this screen */}
    </Stack.Navigator>
  );
}
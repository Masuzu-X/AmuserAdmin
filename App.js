import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import RootNavigator from "./navigators/RootNavigator";

const linking = {
  prefixes: [""],
  config: {
    screens: {
      // RootNavigator returns AuthStack OR AppStack
      AuthStack: {
        screens: {
          Login: "login",
          ForgotPassword: "forgot-password",
        },
      },
      AppStack: {
        screens: {
          Home: "home",
          UserProfile: "profile",
        },
      },
    },
  },
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer linking={linking}>
      <RootNavigator user={user} />
    </NavigationContainer>
  );
}

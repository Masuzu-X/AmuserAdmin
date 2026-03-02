import React from "react";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";

export default function RootNavigator({ user }) {
  if (!user) return <AuthStack />;

  if (user && !user.emailVerified) return <AuthStack />;

  return <AppStack />;
}
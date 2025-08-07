import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  useEffect(() => {
    // Check if user is logged in
    // For now, always redirect to login
    router.replace("/dashboard");
  }, []);

  return <View style={{ flex: 1, backgroundColor: "#f8f9fa" }} />;
}

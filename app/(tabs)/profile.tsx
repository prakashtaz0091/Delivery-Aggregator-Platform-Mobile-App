import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import apiService from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await apiService.getUserData();
    setUser(userData);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          await apiService.logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleUpdateAddress = () => {
    Alert.alert("Update Address", "This feature will be implemented soon!");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {user.first_name} {user.last_name}
              </Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Address Information</Text>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>
                  {user.address || "Address not set"}
                </Text>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleUpdateAddress}
                >
                  <Text style={styles.updateButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Text style={styles.logoutButtonText}>
              {isLoading ? "Logging out..." : "Logout"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#6b7280",
  },
  infoSection: {
    marginBottom: 20,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  updateButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  updateButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  actions: {
    gap: 16,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

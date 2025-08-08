import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DeliveryRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for demonstration
  const mockRequests = [
    {
      id: "1",
      pickupAddress: "123 Main St, City",
      deliveryAddress: "456 Oak Ave, City",
      status: "pending",
      createdAt: "2024-01-15",
      description: "Small package delivery",
    },
    {
      id: "2",
      pickupAddress: "789 Pine Rd, City",
      deliveryAddress: "321 Elm St, City",
      status: "in_progress",
      createdAt: "2024-01-14",
      description: "Document delivery",
    },
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      // Here you would call your API to get delivery requests
      // const data = await apiService.getDeliveryRequests();
      setRequests(mockRequests);
    } catch (error) {
      console.error("Failed to load requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "in_progress":
        return "#3b82f6";
      case "completed":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const renderRequest = ({ item }) => (
    <TouchableOpacity style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.replace("_", " ").toUpperCase()}
          </Text>
        </View>
        <Text style={styles.dateText}>{item.createdAt}</Text>
      </View>

      <Text style={styles.descriptionText}>{item.description}</Text>

      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>From:</Text>
        <Text style={styles.addressText}>{item.pickupAddress}</Text>
      </View>

      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>To:</Text>
        <Text style={styles.addressText}>{item.deliveryAddress}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Delivery Requests</Text>
        <Text style={styles.subtitle}>Track your delivery requests</Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No delivery requests yet</Text>
            <Text style={styles.emptySubtext}>
              Create your first delivery request!
            </Text>
          </View>
        }
      />
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
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  requestCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#6b7280",
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  addressSection: {
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: "#374151",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6b7280",
  },
});

import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateDelivery() {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    description: "",
    specialInstructions: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.pickupAddress || !formData.deliveryAddress) {
      Alert.alert("Error", "Please fill in pickup and delivery addresses");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would call your API to create the delivery request
      // await apiService.createDeliveryRequest(formData);
      Alert.alert("Success", "Delivery request created successfully!");
      setFormData({
        pickupAddress: "",
        deliveryAddress: "",
        description: "",
        specialInstructions: "",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to create delivery request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Delivery Request</Text>
          <Text style={styles.subtitle}>
            Fill in the details for your delivery
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pickup Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.pickupAddress}
              onChangeText={(text) =>
                setFormData({ ...formData, pickupAddress: text })
              }
              placeholder="Enter pickup address"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Delivery Address *</Text>
            <TextInput
              style={styles.input}
              value={formData.deliveryAddress}
              onChangeText={(text) =>
                setFormData({ ...formData, deliveryAddress: text })
              }
              placeholder="Enter delivery address"
              multiline
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              placeholder="Describe what needs to be delivered"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.specialInstructions}
              onChangeText={(text) =>
                setFormData({ ...formData, specialInstructions: text })
              }
              placeholder="Any special handling instructions"
              multiline
              numberOfLines={2}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Creating Request..." : "Create Delivery Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  form: {
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1a1a1a",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AddAccountManagerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    fullName: string;
    email: string;
  }) => void;
};

export default function AddAccountManagerModal({
  visible,
  onClose,
  onSubmit,
}: AddAccountManagerModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const isEmailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    );

  const isFormValid =
    fullName.trim().length > 0 &&
    isEmailValid;

  const handleSubmit = () => {
    if (!isFormValid) {
      return;
    }

    onSubmit({
      fullName: fullName.trim(),
      email: email.trim(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Add Account Manager
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons
                name="close"
                size={18}
                color="#1F2937"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter name"
            placeholderTextColor="#6B7280"
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name@cygnussolutions.co.in"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              !isFormValid && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text
              style={[
                styles.submitText,
                !isFormValid && styles.submitTextDisabled,
              ]}
            >
              Add Account Manager
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: "600",
    color: "#171717",
  },

  input: {
    height: 42,
    borderRadius: 9,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 12,
    fontSize: 12,
    color: "#172238",
    marginBottom: 14,
  },

  submitButton: {
    height: 42,
    borderRadius: 9,
    backgroundColor: "#194F8C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  submitText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  submitButtonDisabled: {
    backgroundColor: "#D7DEE8",
  },

  submitTextDisabled: {
    color: "#8A98AA",
  },
});
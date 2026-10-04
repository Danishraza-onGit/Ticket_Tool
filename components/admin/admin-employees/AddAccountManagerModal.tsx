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
import { COLORS } from "@/constants/colors";

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
                color={COLORS.iconGrey}
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
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name@cygnussolutions.co.in"
            placeholderTextColor={COLORS.placeholder}
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
    color: COLORS.textPrimary,
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  input: {
    height: 42,
    borderRadius: 9,
    backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 12,
    fontSize: 12,
    color: COLORS.textPrimary,
    marginBottom: 14,
  },

  submitButton: {
    height: 42,
    borderRadius: 9,
    backgroundColor: COLORS.navigationActive,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },

  submitText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },

  submitButtonDisabled: {
    backgroundColor: COLORS.navigationActive,
  },

  submitTextDisabled: {
    color: COLORS.white,
  },
});
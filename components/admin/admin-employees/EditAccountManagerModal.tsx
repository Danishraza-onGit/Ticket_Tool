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

import type {
  AccountManager,
} from "../../../types/employee";

type EditAccountManagerModalProps = {
  visible: boolean;
  accountManager: AccountManager | null;
  onClose: () => void;
  onSave: (
    accountManager: AccountManager
  ) => void;
};

export default function EditAccountManagerModal({
  visible,
  accountManager,
  onClose,
  onSave,
}: EditAccountManagerModalProps) {
  const [fullName, setFullName] = useState(
    accountManager?.fullName ?? ""
  );

  const [email, setEmail] = useState(
    accountManager?.email ?? ""
  );


  const handleSave = () => {
    if (!accountManager) return;

    onSave({
      ...accountManager,
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
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />

        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Edit Account Manager
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={18}
                color={COLORS.iconGrey}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            placeholderTextColor={COLORS.placeholder}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor={COLORS.black}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              Save Changes
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
    backgroundColor: "rgba(16, 31, 50, 0.38)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    padding: 20,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 14,
    marginBottom: 4,
  },

  label: {
    marginTop: 15,
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  input: {
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 13,
    fontSize: 12,
    color: COLORS.textPrimary,
  },

  saveButton: {
    height: 46,
    marginTop: 22,
    borderRadius: 11,
    backgroundColor: COLORS.navigationActive,
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
});
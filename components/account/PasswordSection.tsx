import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { PasswordFormData } from "../../types/account";

export default function PasswordSection() {
  const [form, setForm] =
    useState<PasswordFormData>({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const updateField = (
    field: keyof PasswordFormData,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleChangePassword = () => {
  

    Alert.alert(
      "Change Password",
      "Password change will be connected when the API is available."
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Change Password
      </Text>

      <Text style={styles.description}>
        Ensure your account remains safe using a strong
        password.
      </Text>

      <View style={styles.divider} />

      <PasswordInput
        label="Current Password"
        placeholder="Enter current password"
        value={form.currentPassword}
        visible={showCurrentPassword}
        onChangeText={(value) =>
          updateField("currentPassword", value)
        }
        onToggleVisibility={() =>
          setShowCurrentPassword(
            (current) => !current
          )
        }
      />

      <PasswordInput
        label="New Password"
        placeholder="Enter new password"
        value={form.newPassword}
        visible={showNewPassword}
        onChangeText={(value) =>
          updateField("newPassword", value)
        }
        onToggleVisibility={() =>
          setShowNewPassword(
            (current) => !current
          )
        }
      />

      <PasswordInput
        label="Confirm New Password"
        placeholder="Re-enter new password"
        value={form.confirmPassword}
        visible={showConfirmPassword}
        onChangeText={(value) =>
          updateField("confirmPassword", value)
        }
        onToggleVisibility={() =>
          setShowConfirmPassword(
            (current) => !current
          )
        }
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleChangePassword}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          Change Password
        </Text>
      </TouchableOpacity>
    </View>
  );
}

type PasswordInputProps = {
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  onChangeText: (value: string) => void;
  onToggleVisibility: () => void;
};

function PasswordInput({
  label,
  placeholder,
  value,
  visible,
  onChangeText,
  onToggleVisibility,
}: PasswordInputProps) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#687B93"
          secureTextEntry={!visible}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={onToggleVisibility}
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              visible
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={17}
            color="#8EA1B8"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    padding: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8c8d8f",
  },

  description: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: "#2a2b2b",
  },

  divider: {
    height: 1,
    backgroundColor: "#E9EEF4",
    marginTop: 14,
    marginBottom: 6,
  },

  label: {
    marginTop: 14,
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "600",
    color: "#000000",
  },

  passwordInputContainer: {
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#F1F4F7",
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    minHeight: 44,
    paddingLeft: 14,
    paddingRight: 6,
    fontSize: 12,
    color: "#000000",
  },

  eyeButton: {
    width: 42,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButton: {
    height: 48,
    marginTop: 24,
    borderRadius: 11,
    backgroundColor: "#103A76",
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
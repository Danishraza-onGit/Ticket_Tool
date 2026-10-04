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
import { COLORS } from "../../../constants/colors";

import type { AccountProfile } from "../../../types/account";

type ProfileSectionProps = {
  initialProfile: AccountProfile;
};

export default function ProfileSection({
  initialProfile,
}: ProfileSectionProps) {
  const [profile, setProfile] =
    useState<AccountProfile>(initialProfile);

  const updateField = (
    field: keyof AccountProfile,
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    
    Alert.alert(
      "Save Details",
      "Profile update will be connected when the API is available."
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.description}>
        Manage your personal details and account presence.
      </Text>

      <View style={styles.divider} />

      {/* Username */}
      <Text style={styles.label}>Username</Text>

      <View style={styles.lockedInputContainer}>
        <Text style={styles.lockedInputText}>
          {profile.username}
        </Text>

        <Ionicons
          name="lock-closed"
          size={13}
          color={COLORS.iconGrey}
        />
      </View>

      <Text style={styles.helperText}>
        Username is managed by directory permissions.
      </Text>

      {/* Display Name */}
      <Text style={styles.label}>Display Name</Text>

      <TextInput
        style={styles.input}
        value={profile.displayName}
        onChangeText={(value) =>
          updateField("displayName", value)
        }
        placeholder="Enter display name"
        placeholderTextColor={COLORS.placeholder}
      />

      {/* Email */}
      <Text style={styles.label}>Email</Text>

      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={(value) =>
          updateField("email", value)
        }
        placeholder="Enter email"
        placeholderTextColor={COLORS.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          Save Details
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.black,
  },

  description: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 14,
    marginBottom: 18,
  },

  label: {
    marginBottom: 7,
    marginTop: 14,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.black,
  },

  lockedInputContainer: {
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.searchButtonBackground,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  lockedInputText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textLabel,
  },

  helperText: {
    marginTop: 6,
    fontSize: 9.5,
    color: COLORS.textDark,
  },

  input: {
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    fontSize: 12,
    color: COLORS.textLabel,
  },

  primaryButton: {
    height: 48,
    marginTop: 24,
    borderRadius: 11,
    backgroundColor: COLORS.navigationActive,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
});

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

import { updateCurrentUserProfile } from "../../../api/auth";
import { COLORS } from "../../../constants/colors";
import type { AccountProfile } from "../../../types/account";

type ProfileSectionProps = {
  initialProfile: AccountProfile;
  onProfileUpdated: (profile: AccountProfile) => void;
};

export default function ProfileSection({
  initialProfile,
  onProfileUpdated,
}: ProfileSectionProps) {
  const [profile, setProfile] =
    useState<AccountProfile>(initialProfile);

  const [isSaving, setIsSaving] = useState(false);

  const updateField = (
    field: "displayName" | "email",
    value: string
  ) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const displayName = profile.displayName.trim();
    const email = profile.email.trim();

    if (!displayName) {
      Alert.alert(
        "Invalid Display Name",
        "Please enter your display name."
      );
      return;
    }

    if (displayName.length > 100) {
      Alert.alert(
        "Invalid Display Name",
        "Display name cannot exceed 100 characters."
      );
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address."
      );
      return;
    }

    try {
      setIsSaving(true);

      const updatedUser = await updateCurrentUserProfile({
        displayName,
        email,
      });

      const updatedProfile: AccountProfile = {
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        email: updatedUser.email ?? "",
      };

      setProfile(updatedProfile);
      onProfileUpdated(updatedProfile);

      Alert.alert(
        "Profile Updated",
        "Your account details have been saved."
      );
    } catch (error) {
      console.log("Employee profile update error:", error);

      Alert.alert(
        "Update Failed",
        "Unable to save your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Profile
      </Text>

      <Text style={styles.description}>
        Manage your personal details and account presence.
      </Text>

      <View style={styles.divider} />

      <Text style={[styles.label, styles.firstLabel]}>
        Username
      </Text>

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

      <Text style={styles.label}>
        Display Name
      </Text>

      <TextInput
        style={styles.input}
        value={profile.displayName}
        onChangeText={(value) =>
          updateField("displayName", value)
        }
        placeholder="Enter display name"
        placeholderTextColor={COLORS.placeholder}
        autoCapitalize="words"
        maxLength={100}
      />

      <Text style={styles.label}>
        Email
      </Text>

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
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[
          styles.primaryButton,
          isSaving && styles.disabledButton,
        ]}
        onPress={() => void handleSave()}
        disabled={isSaving}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          {isSaving ? "Saving..." : "Save Details"}
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
    marginTop: 10,
    marginBottom: 18,
  },
  label: {
    marginBottom: 7,
    marginTop: 14,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.black,
  },
  firstLabel: {
    marginTop: 0,
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
    color: COLORS.textPrimary,
  },
  primaryButton: {
    height: 48,
    marginTop: 24,
    borderRadius: 11,
    backgroundColor: COLORS.navigationActive,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
  },
});

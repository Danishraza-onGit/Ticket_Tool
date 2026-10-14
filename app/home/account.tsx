
import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import {
  useFocusEffect,
  useRouter,
} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getCurrentUser,
  logout,
} from "../../api/auth";

import type { AuthUser } from "../../api/auth";

import AccountSummaryCard from "../../components/admin/account/AccountSummaryCard";
import AccountTabs from "../../components/admin/account/AccountTabs";
import ProfileSection from "../../components/admin/account/ProfileSection";
import PasswordSection from "../../components/admin/account/PasswordSection";
import SettingsSection from "../../components/admin/account/SettingsSection";
import SessionSecurityCard from "../../components/admin/account/SessionSecurityCard";
import BackHeader from "../../components/admin/navigation/BackHeader";

import type {
  AccountProfile,
  AccountTab,
} from "../../types/account";

import { COLORS } from "../../constants/colors";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "—";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function AccountScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<AccountTab>("profile");

  const [currentUser, setCurrentUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  // const notificationsEnabled = false;

  const loadAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const user = await getCurrentUser();

      if (user.role !== "admin") {
        throw new Error("Admin account required.");
      }

      setCurrentUser(user);
    } catch (error) {
      console.log("Account API error:", error);

      setCurrentUser(null);
      setLoadError("Unable to load account information.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAccount();
    }, [loadAccount])
  );

  const handleProfileUpdated = (
    profile: AccountProfile
  ) => {
    setCurrentUser((current) =>
      current
        ? {
          ...current,
          displayName: profile.displayName,
          email: profile.email || null,
        }
        : current
    );
  };

  // const handleNotificationsPress = () => {
  //   Alert.alert(
  //     "Push Notifications",
  //     "Notification preferences are not connected to the backend yet."
  //   );
  // };

  const performLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);

      await logout();

      setCurrentUser(null);
      router.replace("/login");
    } catch (error) {
      console.log("Logout API error:", error);

      Alert.alert(
        "Logout Failed",
        "Unable to end your session. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => void performLogout(),
        },
      ]
    );
  };

  const profile: AccountProfile | null = currentUser
    ? {
      username: currentUser.username,
      displayName: currentUser.displayName,
      email: currentUser.email ?? "",
    }
    : null;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />

      <BackHeader
        title="Account"
        onBackPress={() => router.back()}
      />

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator
            color={COLORS.navigationActive}
          />

          <Text style={styles.stateText}>
            Loading account...
          </Text>
        </View>
      ) : loadError || !profile ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>
            {loadError || "Account unavailable."}
          </Text>

          <TouchableOpacity
            onPress={() => void loadAccount()}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={
            Platform.OS === "ios" ? "padding" : undefined
          }
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AccountSummaryCard
              initials={getInitials(profile.displayName)}
              displayName={profile.displayName}
              email={profile.email || "—"}
              role="Admin"
            />

            <AccountTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {activeTab === "profile" && (

              <ProfileSection
                key={currentUser?.id}
                initialProfile={profile}
                onProfileUpdated={handleProfileUpdated}
              />

            )}

            {activeTab === "password" && (
              <PasswordSection />
            )}

            {activeTab === "settings" && (
              <SettingsSection />
            )}

            <SessionSecurityCard
              // notificationsEnabled={notificationsEnabled}
              // onNotificationsPress={
              //   handleNotificationsPress
              // }
              onLogoutPress={handleLogout}
            />

            {isLoggingOut && (
              <View style={styles.logoutState}>
                <ActivityIndicator
                  color={COLORS.navigationActive}
                />
                <Text style={styles.stateText}>
                  Logging out...
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },

  stateText: {
    fontSize: 12,
    color: COLORS.textBody,
    textAlign: "center",
  },

  retryText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },

  logoutState: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});

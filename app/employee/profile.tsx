import React, {
  useState,
} from "react";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

import {
  useRouter,
} from "expo-router";

import {
  StatusBar,
} from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  COLORS,
} from "../../constants/colors";

import EmployeeHeader from "../../components/employee/navigation/EmployeeHeader";

import AccountSummaryCard from "../../components/employee/account/AccountSummaryCard";

import AccountTabs, {
  EmployeeAccountTab,
} from "../../components/employee/account/AccountTabs";

import ProfileSection from "../../components/employee/account/ProfileSection";

import PasswordSection from "../../components/employee/account/PasswordSection";

import SessionSecurityCard from "../../components/employee/account/SessionSecurityCard";

import type {
  AccountProfile,
} from "../../types/account";

const temporaryEmployeeProfile: AccountProfile = {
  username: "employee",

  displayName:
    "Mohammed Danish Raza",

  email:
    "employee@cygnusanalytics.ai",
};

export default function EmployeeProfileScreen() {
  const router = useRouter();

  const [
    activeTab,
    setActiveTab,
  ] = useState<EmployeeAccountTab>(
    "profile"
  );

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <StatusBar style="dark" />

      <EmployeeHeader
        onProfilePress={() =>
          undefined
        }
      />

      <KeyboardAvoidingView
        style={
          styles.keyboardView
        }
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          style={
            styles.scrollView
          }
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          <AccountSummaryCard
            initials="MD"
            displayName={
              temporaryEmployeeProfile.displayName
            }
            email={
              temporaryEmployeeProfile.email
            }
            role="Employee"
          />

          <AccountTabs
            activeTab={activeTab}
            onTabChange={
              setActiveTab
            }
          />

          {activeTab ===
            "profile" && (
            <ProfileSection
              initialProfile={
                temporaryEmployeeProfile
              }
            />
          )}

          {activeTab ===
            "password" && (
            <PasswordSection />
          )}

          <SessionSecurityCard
            onLogoutPress={
              handleLogout
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        COLORS.background,
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

      paddingBottom: 100,
    },
  });
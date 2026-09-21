import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { SmtpSettings } from "../../types/account";

const initialSettings: SmtpSettings = {
  host: "smtp.gmail.com",
  port: "587",
  username: "smtp-user@domain.com",
  password: "",
  fromAddress: "noreply@company.com",
  fromName: "Cygnus Support",
  useTlsSsl: true,
};

export default function SettingsSection() {
  const [settings, setSettings] =
    useState<SmtpSettings>(initialSettings);

  const updateField = (
    field: keyof SmtpSettings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    /*
     * Connect SMTP/settings API later.
     */

    Alert.alert(
      "Save Settings",
      "SMTP settings will be connected when the API is available."
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={styles.description}>
        Configure the SMTP server used to email customers
        (repair-complete and feedback requests) and
        employees.
      </Text>

      <View style={styles.divider} />

      <SettingsInput
        label="SMTP Host"
        value={settings.host}
        onChangeText={(value) =>
          updateField("host", value)
        }
      />

      <SettingsInput
        label="Port"
        value={settings.port}
        keyboardType="number-pad"
        onChangeText={(value) =>
          updateField("port", value)
        }
      />

      <SettingsInput
        label="Username"
        value={settings.username}
        autoCapitalize="none"
        onChangeText={(value) =>
          updateField("username", value)
        }
      />

      <SettingsInput
        label="Password"
        value={settings.password}
        secureTextEntry
        placeholder="Enter SMTP password"
        onChangeText={(value) =>
          updateField("password", value)
        }
      />

      <SettingsInput
        label="From Address"
        value={settings.fromAddress}
        autoCapitalize="none"
        onChangeText={(value) =>
          updateField("fromAddress", value)
        }
      />

      <SettingsInput
        label="From Name"
        value={settings.fromName}
        onChangeText={(value) =>
          updateField("fromName", value)
        }
      />

      <View style={styles.switchRow}>
        <Switch
          value={settings.useTlsSsl}
          onValueChange={(value) =>
            updateField("useTlsSsl", value)
          }
          trackColor={{
            false: "#CBD5E1",
            true: "#103A76",
          }}
          thumbColor="#FFFFFF"
        />

        <Text style={styles.switchLabel}>
          Use TLS/SSL (secure)
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSave}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>
          Save Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
}

type SettingsInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "number-pad";
  autoCapitalize?: "none" | "sentences";
  onChangeText: (value: string) => void;
};

function SettingsInput({
  label,
  value,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
  onChangeText,
}: SettingsInputProps) {
  return (
    <>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8EA1B8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
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
    color: "#000000",
  },

  description: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 17,
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

  input: {
    minHeight: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#DCE4ED",
    backgroundColor: "#F1F4F7",
    paddingHorizontal: 14,
    fontSize: 12,
    color: "#26364C",
  },

  switchRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  switchLabel: {
    marginLeft: 8,
    fontSize: 11,
    fontWeight: "500",
    color: "#26364C",
  },

  primaryButton: {
    height: 48,
    marginTop: 22,
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
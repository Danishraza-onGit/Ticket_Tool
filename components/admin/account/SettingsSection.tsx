
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";

import {
  fetchSmtpSettings,
  updateSmtpSettings,
} from "../../../api/settings";

import { COLORS } from "../../../constants/colors";

import type { SmtpSettings } from "../../../types/account";

const emptySettings: SmtpSettings = {
  host: "",
  port: "587",
  username: "",
  password: "",
  fromAddress: "",
  fromName: "",
  useTlsSsl: false,
};

export default function SettingsSection() {
  const [settings, setSettings] =
    useState<SmtpSettings>(emptySettings);

  const [hasSavedPassword, setHasSavedPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      const response = await fetchSmtpSettings();

      setSettings({
        host: response.host,
        port: String(response.port),
        username: response.username,
        password: "",
        fromAddress: response.fromAddress,
        fromName: response.fromName,
        useTlsSsl: response.secure,
      });

      setHasSavedPassword(response.hasPassword);
    } catch (error) {
      console.log("SMTP settings load error:", error);

      setLoadError(
        "Unable to load SMTP settings. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadSettings();
    }, [loadSettings])
  );

  const updateField = (
    field: keyof SmtpSettings,
    value: string | boolean
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (isSaving || isLoading) {
      return;
    }

    const host = settings.host.trim();
    const port = Number(settings.port.trim());
    const username = settings.username.trim();
    const password = settings.password;
    const fromAddress = settings.fromAddress.trim();
    const fromName = settings.fromName.trim();

    if (!host) {
      Alert.alert(
        "SMTP Host Required",
        "Please enter your SMTP server host."
      );
      return;
    }

    if (
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      Alert.alert(
        "Invalid Port",
        "Please enter a valid port between 1 and 65535."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromAddress)
    ) {
      Alert.alert(
        "Invalid From Address",
        "Please enter a valid sender email address."
      );
      return;
    }

    try {
      setIsSaving(true);

      await updateSmtpSettings({
        host,
        port,
        username,
        password,
        fromAddress,
        fromName,
        secure: settings.useTlsSsl,
      });

      const response = await fetchSmtpSettings();

      setSettings({
        host: response.host,
        port: String(response.port),
        username: response.username,
        password: "",
        fromAddress: response.fromAddress,
        fromName: response.fromName,
        useTlsSsl: response.secure,
      });

      setHasSavedPassword(response.hasPassword);

      Alert.alert(
        "Settings Saved",
        "Your SMTP configuration has been saved successfully."
      );
    } catch (error) {
      console.log("SMTP settings update error:", error);

      Alert.alert(
        "Unable to Save Settings",
        "Please check your SMTP details and try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.card}>
        <View style={styles.centerState}>
          <ActivityIndicator
            color={COLORS.navigationActive}
          />

          <Text style={styles.stateText}>
            Loading SMTP settings...
          </Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.card}>
        <View style={styles.centerState}>
          <Text style={styles.stateText}>
            {loadError}
          </Text>

          <TouchableOpacity
            onPress={() => void loadSettings()}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.description}>
        Configure the SMTP server used to email customers
        (repair-complete and feedback requests) and
        employees.
      </Text>

      <View style={styles.divider} />

      <SettingsInput
        label="SMTP Host"
        value={settings.host}
        placeholder="smtp.gmail.com"
        autoCapitalize="none"
        onChangeText={(value) =>
          updateField("host", value)
        }
      />

      <SettingsInput
        label="Port"
        value={settings.port}
        placeholder="587"
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
        placeholder={
          hasSavedPassword
            ? "Leave blank to keep saved password"
            : undefined
        }
        onChangeText={(value) =>
          updateField("password", value)
        }
      />

      {hasSavedPassword && (
        <Text style={styles.helperText}>
          A password is already saved. Enter a new one
          only if you want to replace it.
        </Text>
      )}

      <SettingsInput
        label="From Address"
        value={settings.fromAddress}
        placeholder="noreply@company.com"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(value) =>
          updateField("fromAddress", value)
        }
      />

      <SettingsInput
        label="From Name"
        value={settings.fromName}
        placeholder="Cygnus Support"
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
            false: COLORS.textMuted,
            true: COLORS.navigationActive,
          }}
          thumbColor={COLORS.white}
        />

        <Text style={styles.switchLabel}>
          Use TLS/SSL (secure)
        </Text>
      </View>

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
          {isSaving ? "Saving..." : "Save Settings"}
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
  keyboardType?: "default" | "number-pad" | "email-address";
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
        placeholderTextColor={COLORS.textPrimary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </>
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
    color: COLORS.textPrimary,
  },

  description: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginTop: 14,
    marginBottom: 6,
  },

  label: {
    marginTop: 14,
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
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

  helperText: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 15,
    color: COLORS.textBody,
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
    color: COLORS.textPrimary,
  },

  primaryButton: {
    height: 48,
    marginTop: 22,
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

  centerState: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  stateText: {
    fontSize: 12,
    color: COLORS.textBody,
    textAlign: "center",
  },

  retryText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navigationActive,
  },
});

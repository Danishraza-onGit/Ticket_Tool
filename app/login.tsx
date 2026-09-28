import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim()) {
      Alert.alert(
        "Username Required",
        "Please enter your username."
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Password Required",
        "Please enter your password."
      );
      return;
    }

    setIsLoading(true);

    // Temporary mock login.
    // Real authentication will be connected later.
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/home");
    }, 500);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password?",
      "Please contact your Cygnus administrator to reset your password."
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" translucent />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          {/* Top building image */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/images/cygnus-login-building.jpg")}
              style={styles.buildingImage}
              resizeMode="cover"
            />
          </View>

          {/* White login sheet */}
          <View style={styles.loginSheet}>
            {/* Small handle shown in reference */}
            <View style={styles.handle} />

            {/* Existing Cygnus logo */}
            <Image
              source={require("../assets/images/cygnus-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Heading */}
            <View style={styles.headingContainer}>
              <Text style={styles.title}>
                Login to your account
              </Text>

              <Text style={styles.subtitle}>
                Enter your credentials to continue
              </Text>
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>

              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor="#7D8DA1"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#7D8DA1"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />

                <Pressable
                  onPress={() =>
                    setShowPassword((current) => !current)
                  }
                  style={styles.visibilityButton}
                  hitSlop={8}
                >
                  <Text style={styles.visibilityText}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Forgot password */}
            <Pressable
              onPress={handleForgotPassword}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>
                Forgot Password?
              </Text>
            </Pressable>

            {/* Login */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
                isLoading && styles.loginButtonDisabled,
              ]}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </Pressable>

            {/* Footer */}
            <Text style={styles.copyright}>
              © 2025. Cygnus Information Solutions Pvt. Ltd.
              {"\n"}
              All rights reserved.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  imageContainer: {
    width: "100%",
    height: 325,
    overflow: "hidden",
  },

  buildingImage: {
    width: "100%",
    height: "100%",
    transform: [
    { scale: 1.05 },
    { translateY: -8 },
  ],
  },

  loginSheet: {
    flex: 1,

    marginTop: -30,

    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 28,

    minHeight: 590,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,

    backgroundColor: "#DCE3EB",

    alignSelf: "center",

    marginBottom: 14,
  },

  logo: {
    width: 190,
    height: 62,
    alignSelf: "center",
    marginBottom: 20,
  },

  headingContainer: {
    marginBottom: 26,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",

    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#66758A",
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",

    color: "#374151",

    marginBottom: 8,
  },

  input: {
    height: 54,

    borderWidth: 1,
    borderColor: "#DCE3EB",
    borderRadius: 11,

    paddingHorizontal: 16,

    backgroundColor: "#FAFBFC",

    fontSize: 15,
    color: "#111827",
  },

  passwordContainer: {
    height: 54,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#DCE3EB",
    borderRadius: 11,

    backgroundColor: "#FAFBFC",
  },

  passwordInput: {
    flex: 1,
    height: "100%",

    paddingHorizontal: 16,

    fontSize: 15,
    color: "#111827",
  },

  visibilityButton: {
    height: "100%",

    justifyContent: "center",

    paddingHorizontal: 15,
  },

  visibilityText: {
    fontSize: 13,
    fontWeight: "500",

    color: "#66758A",
  },

  forgotButton: {
    alignSelf: "flex-end",

    marginTop: -2,
    marginBottom: 24,

    paddingVertical: 4,
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "500",

    color: "#2447BE",
  },

  loginButton: {
    height: 52,

    borderRadius: 9,

    backgroundColor: "#163C70",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,

    elevation: 3,
  },

  loginButtonPressed: {
    opacity: 0.88,
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    fontSize: 15,
    fontWeight: "700",

    color: "#FFFFFF",
  },

  copyright: {
    marginTop: "auto",

    paddingTop: 40,

    textAlign: "center",

    fontSize: 10.5,
    lineHeight: 16,

    color: "#8295B1",
  },
});
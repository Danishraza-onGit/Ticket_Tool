import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type BackHeaderProps = {
  onBackPress: () => void;
};

export default function BackHeader({
  onBackPress,
}: BackHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name="arrow-back"
          size={23}
          color="#174F8A"
        />
      </TouchableOpacity>

      {/* CYGNUS branding */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          CYGNUS
        </Text>

        <Text style={styles.logoSubtitle}>
          TICKETING SYSTEM
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 62,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E7EF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
  },

  backButton: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",
  },

  logoContainer: {
    marginLeft: 4,
  },

  logoText: {
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#174F8A",
  },

  logoSubtitle: {
    fontSize: 7,
    letterSpacing: 1,
    color: "#8BA0B7",
    marginTop: 1,
  },
});
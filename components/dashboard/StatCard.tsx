import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type StatCardProps = {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
};

export default function StatCard({
  title,
  value,
  icon,
  fullWidth = false,
}: StatCardProps) {
  const { width } = useWindowDimensions();

  const horizontalPadding = 32;
  const gap = 12;

  const cardWidth = fullWidth
    ? width - horizontalPadding * 2
    : (width - horizontalPadding * 2 - gap) / 2;

  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color="#174F8A" />
      </View>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    minHeight: 125,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E5EAF0",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,

    elevation: 2,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EAF2FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  value: {
    fontSize: 27,
    fontWeight: "700",
    color: "#17324D",
  },

  title: {
    fontSize: 13,
    color: "#687789",
    marginTop: 3,
  },
});
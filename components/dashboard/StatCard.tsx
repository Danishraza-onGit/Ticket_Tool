import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type StatCardProps = {
  title: string;
  value: number;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export default function StatCard({
  title,
  value,
  backgroundColor,
  borderColor,
  textColor,
}: StatCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>

      <Text style={[styles.value, { color: textColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 82,

    borderRadius: 14,
    borderWidth: 1,

    paddingHorizontal: 14,
    paddingVertical: 12,

    justifyContent: "space-between",

    // Subtle shadow mainly below the card
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.1,
    elevation: 3,
  },

  title: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
  },
});
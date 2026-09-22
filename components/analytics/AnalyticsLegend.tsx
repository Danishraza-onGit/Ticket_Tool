import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type LegendItem = {
  label: string;
  color: string;
};

type AnalyticsLegendProps = {
  items: LegendItem[];
};

export default function AnalyticsLegend({
  items,
}: AnalyticsLegendProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View
          key={item.label}
          style={styles.item}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor: item.color,
              },
            ]}
          />

          <Text style={styles.label}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,

    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "center",
    gap: 10,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 2,
  },

  label: {
    fontSize: 9,
    color: "#2a2a2b",
  },
});
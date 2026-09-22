import React, { ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

type AnalyticsChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerRight?: ReactNode;
};

export default function AnalyticsChartCard({
  title,
  subtitle,
  children,
  headerRight,
}: AnalyticsChartCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>
            {title}
          </Text>

          {subtitle ? (
            <Text style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {headerRight}
      </View>

      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 13,
    padding: 14,
    marginBottom: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  heading: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 14,
    color: "#2a2a2b",
  },

  content: {
    marginTop: 16,
  },
});
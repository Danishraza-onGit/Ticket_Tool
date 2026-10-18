import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../constants/colors";

type Props = { title: string; subtitle?: string; children: ReactNode; headerRight?: ReactNode };
export default function AnalyticsChartCard({ title, subtitle, children, headerRight }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {headerRight}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, padding: 14, marginBottom: 12 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 6 },
  heading: { flex: 1 },
  title: { fontSize: 13, fontWeight: "700", color: COLORS.textPrimary },
  subtitle: { marginTop: 4, fontSize: 10, lineHeight: 15, color: COLORS.textNeutral },
  content: { marginTop: 12 },
});

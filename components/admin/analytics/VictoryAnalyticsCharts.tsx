import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Area, Bar, CartesianChart, Line, Pie, PolarChart, StackedBar, useChartPressState } from "victory-native";
import { useAnimatedReaction, runOnJS } from "react-native-reanimated";
import type { AnalyticsEmployeeStatus, AnalyticsVolumePoint } from "../../../types/analytics";
import { COLORS } from "../../../constants/colors";

export type CategoryCount = { label: string; value: number };
const PALETTE = ["#88B6EF", "#236DCD", "#1C549D", "#103665", "#5C96DB", "#4B7BAD", "#A8C9F3"];
const STATUS_COLORS = ["#88B6EF", "#236DCD", "#1C549D"];

function EmptyChart() {
  return <View style={styles.empty}><Text style={styles.emptyText}>No analytics data available</Text></View>;
}

function Legend({ rows, onSelect }: { rows: { label: string; color: string; value?: number }[]; onSelect?: (index: number) => void }) {
  return (
    <View style={styles.legend}>
      {rows.map((r, i) => (
        <Pressable key={`${r.label}-${i}`} disabled={!onSelect} onPress={() => onSelect?.(i)} style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: r.color }]} />
          <Text style={styles.legendText} numberOfLines={2}>{r.label}{r.value !== undefined ? ` (${r.value})` : ""}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// The chart uses x = index + 0.5 and domain x = [0, categoryCount].
// Each label occupies precisely the same 1/categoryCount share of the width.
// This keeps every label directly under the center of its bar.
function AxisLabels({ rows }: { rows: string[] }) {
  return (
    <View style={styles.axisRow}>
      {rows.map((r, i) => <Text numberOfLines={2} key={`${r}-${i}`} style={styles.axisLabel}>{r}</Text>)}
    </View>
  );
}

function SelectionPopup({ title, lines }: { title: string; lines: { label: string; value: number; color: string }[] }) {
  return (
    <View pointerEvents="none" style={styles.popup}>
      <Text style={styles.popupTitle} numberOfLines={2}>{title}</Text>
      {lines.map((line) => (
        <View key={line.label} style={styles.popupRow}>
          <View style={[styles.popupDot, { backgroundColor: line.color }]} />
          <Text style={styles.popupLabel}>{line.label}</Text>
          <Text style={styles.popupValue}>{line.value}</Text>
        </View>
      ))}
    </View>
  );
}

// Victory Native's press state lives on the UI thread. Reflect only the selected
// category index in React state, leaving chart dragging/gesture handling native.
function useSelectedCategory(yKeys: Record<string, number>) {
  const { state } = useChartPressState({ x: 0, y: yKeys });
  const [selected, setSelected] = useState<number | null>(null);
  const updateSelection = useCallback((next: number | null) => setSelected(next), []);
  useAnimatedReaction(
    () => ({ active: state.isActive.value, x: state.x.value.value }),
    (next, prev) => {
      if (next.active !== prev?.active || (next.active && Math.floor(next.x) !== Math.floor(prev?.x ?? -1))) {
        runOnJS(updateSelection)(next.active && Number.isFinite(next.x) ? Math.floor(next.x) : null);
      }
    },
    [updateSelection]
  );
  return { pressState: state, selected };
}

export function VolumeChart({ data }: { data: AnalyticsVolumePoint[] }) {
  // Keep hooks unconditional even when the API returns an empty array.
  const { pressState, selected } = useSelectedCategory({ created: 0, closed: 0 });
  if (!data.length) return <EmptyChart />;
  const rows = data.map((r, i) => ({ x: i + 0.5, created: r.created, closed: r.closed }));
  const max = Math.max(1, ...data.flatMap((r) => [r.created, r.closed]));
  const active = selected !== null ? data[selected] : undefined;
  return (
    <View>
      <View style={styles.graph}>
        <CartesianChart data={rows} xKey="x" yKeys={["created", "closed"]} domain={{ x: [0, data.length], y: [0, Math.max(2, Math.ceil(max * 1.15))] }} chartPressState={pressState}>
          {({ points, chartBounds }) => (
            <>
              <Area points={points.created} y0={chartBounds.bottom} color="#88B6EF" opacity={0.38} curveType="natural" />
              <Area points={points.closed} y0={chartBounds.bottom} color="#1C549D" opacity={0.23} curveType="natural" />
              <Line points={points.created} color="#236DCD" strokeWidth={2} curveType="natural" />
              <Line points={points.closed} color="#1C549D" strokeWidth={2} curveType="natural" />
            </>
          )}
        </CartesianChart>
        {active && <SelectionPopup title={active.month} lines={[{ label: "Created", value: active.created, color: "#236DCD" }, { label: "Closed", value: active.closed, color: "#1C549D" }]} />}
      </View>
      <AxisLabels rows={data.map((r) => r.month)} />
      <Legend rows={[{ label: "Created", color: "#236DCD" }, { label: "Closed", color: "#1C549D" }]} />
    </View>
  );
}

export function CategoryBarChart({ data }: { data: CategoryCount[] }) {
  const { pressState, selected } = useSelectedCategory({ value: 0 });
  const filtered = data.filter((r) => r.value > 0);
  if (!filtered.length) return <EmptyChart />;
  const rows = filtered.map((r, i) => ({ x: i + 0.5, value: r.value }));
  const max = Math.max(...filtered.map((r) => r.value), 1);
  const wide = filtered.length > 5;
  const active = selected !== null ? filtered[selected] : undefined;
  return (
    <ScrollView horizontal={wide} showsHorizontalScrollIndicator={wide} nestedScrollEnabled>
      <View style={wide ? { width: filtered.length * 76 } : styles.fullWidth}>
        <View style={styles.graph}>
          <CartesianChart data={rows} xKey="x" yKeys={["value"]} domain={{ x: [0, filtered.length], y: [0, Math.max(2, Math.ceil(max * 1.15))] }} chartPressState={pressState}>
            {({ points, chartBounds }) => <Bar points={points.value} chartBounds={chartBounds} barWidth={wide ? 42 : Math.min(52, 240 / filtered.length)} color="#1C549D" roundedCorners={{ topLeft: 4, topRight: 4 }} />}
          </CartesianChart>
          {active && <SelectionPopup title={active.label} lines={[{ label: "Count", value: active.value, color: "#1C549D" }]} />}
        </View>
        <AxisLabels rows={filtered.map((r) => r.label)} />
        <Legend rows={filtered.map((r) => ({ label: r.label, color: "#1C549D", value: r.value }))} />
      </View>
    </ScrollView>
  );
}

export function EmployeeStackedChart({ data }: { data: AnalyticsEmployeeStatus[] }) {
  const { pressState, selected } = useSelectedCategory({ closed: 0, inProgress: 0, pending: 0 });
  const filtered = data.filter((r) => r.pending + r.inProgress + r.closed > 0);
  if (!filtered.length) return <EmptyChart />;
  const rows = filtered.map((r, i) => ({ x: i + 0.5, pending: r.pending, inProgress: r.inProgress, closed: r.closed }));
  const max = Math.max(1, ...filtered.map((r) => r.pending + r.inProgress + r.closed));
  const wide = filtered.length > 4;
  const active = selected !== null ? filtered[selected] : undefined;
  return (
    <ScrollView horizontal={wide} showsHorizontalScrollIndicator={wide} nestedScrollEnabled>
      <View style={wide ? { width: filtered.length * 94 } : styles.fullWidth}>
        <View style={styles.graph}>
          <CartesianChart data={rows} xKey="x" yKeys={["closed", "inProgress", "pending"]} domain={{ x: [0, filtered.length], y: [0, Math.max(2, Math.ceil(max * 1.15))] }} chartPressState={pressState}>
            {({ points, chartBounds }) => (
              <StackedBar points={[points.closed, points.inProgress, points.pending]} chartBounds={chartBounds} barWidth={wide ? 50 : Math.min(60, 260 / filtered.length)} colors={[STATUS_COLORS[2], STATUS_COLORS[1], STATUS_COLORS[0]]} />
            )}
          </CartesianChart>
          {active && <SelectionPopup title={active.employee} lines={[{ label: "Closed", value: active.closed, color: STATUS_COLORS[2] }, { label: "In Progress", value: active.inProgress, color: STATUS_COLORS[1] }, { label: "Pending", value: active.pending, color: STATUS_COLORS[0] }]} />}
        </View>
        <AxisLabels rows={filtered.map((r) => r.employee.split(" ")[0])} />
        <Legend rows={[{ label: "Closed", color: STATUS_COLORS[2] }, { label: "In Progress", color: STATUS_COLORS[1] }, { label: "Pending", color: STATUS_COLORS[0] }]} />
        <Text style={styles.caption}>Employees shown by first name; totals include all assigned records.</Text>
      </View>
    </ScrollView>
  );
}

export function DonutChart({ data, colors }: { data: CategoryCount[]; colors?: string[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = data.filter((r) => r.value > 0);
  if (!filtered.length) return <EmptyChart />;
  const palette = colors ?? PALETTE;
  const rows = filtered.map((r, i) => ({ label: r.label, value: r.value, color: palette[i % palette.length] }));
  const total = filtered.reduce((sum, row) => sum + row.value, 0);
  const active = selected === null ? undefined : rows[selected];
  return (
    <View>
      <View style={styles.donutWrap}>
        <View style={styles.donutCanvas} onStartShouldSetResponder={() => true} onResponderRelease={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          const dx = locationX - 96;
          const dy = locationY - 96;
          const distance = Math.hypot(dx, dy);
          if (distance < 54 || distance > 96) { setSelected(null); return; }
          // Victory's default 0° points upward; angles increase clockwise.
          const angle = ((Math.atan2(dy, dx) * 180 / Math.PI) + 90 + 360) % 360;
          let cumulative = 0;
          const index = rows.findIndex((row) => {
            cumulative += row.value / total * 360;
            return angle < cumulative;
          });
          setSelected(index >= 0 ? index : rows.length - 1);
        }}>
          <PolarChart data={rows} labelKey="label" valueKey="value" colorKey="color">
            <Pie.Chart innerRadius="63%" />
          </PolarChart>
        </View>
        <View pointerEvents="none" style={styles.donutCenter}>
          <Text style={styles.donutTotal}>{total}</Text>
          <Text style={styles.donutCaption}>Total</Text>
        </View>
        {active && <SelectionPopup title={active.label} lines={[{ label: "Count", value: active.value, color: active.color }]} />}
      </View>
      <Legend rows={rows} onSelect={(index) => setSelected(index)} />
    </View>
  );
}

export const ANALYTICS_COLORS = { status: STATUS_COLORS, palette: PALETTE };

const styles = StyleSheet.create({
  fullWidth: { width: "100%" },
  graph: { height: 185, width: "100%", position: "relative" },
  empty: { height: 145, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 11, color: COLORS.textNeutral },
  axisRow: { flexDirection: "row", alignItems: "flex-start", width: "100%", marginTop: 8 },
  axisLabel: { flex: 1, fontSize: 9, lineHeight: 13, textAlign: "center", color: COLORS.textNeutral, paddingHorizontal: 2 },
  legend: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 15 },
  legendItem: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, maxWidth: "95%", paddingVertical: 3 },
  dot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { fontSize: 10, color: COLORS.textSecondary, textAlign: "center" },
  caption: { fontSize: 9, color: COLORS.textNeutral, textAlign: "center", marginTop: 8 },
  popup: { position: "absolute", zIndex: 10, alignSelf: "center", top: 10, minWidth: 124, maxWidth: "82%", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 9, borderWidth: 1, borderColor: "#DCE4ED", backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.13, shadowRadius: 7, elevation: 4 },
  popupTitle: { color: COLORS.textPrimary, fontSize: 11, fontWeight: "700", marginBottom: 4, textAlign: "center" },
  popupRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 },
  popupDot: { width: 7, height: 7, borderRadius: 2 },
  popupLabel: { flex: 1, fontSize: 10, color: COLORS.textSecondary },
  popupValue: { fontSize: 10, color: COLORS.textPrimary, fontWeight: "700" },
  donutWrap: { alignSelf: "center", width: 192, height: 192, alignItems: "center", justifyContent: "center", position: "relative" },
  donutCanvas: { width: 192, height: 192 },
  donutCenter: { position: "absolute", alignItems: "center", justifyContent: "center" },
  donutTotal: { fontSize: 21, fontWeight: "700", color: COLORS.textPrimary },
  donutCaption: { fontSize: 9, color: COLORS.textNeutral },
});

import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { fetchProjectAnalytics, fetchTicketAnalytics } from "../../api/analytics";
import type { AnalyticsPeriod, ProjectAnalyticsResponse, TicketAnalyticsResponse } from "../../types/analytics";
import BackHeader from "../../components/admin/navigation/BackHeader";
import AnalyticsChartCard from "../../components/admin/analytics/AnalyticsChartCard";
import { CategoryBarChart, DonutChart, EmployeeStackedChart, VolumeChart, ANALYTICS_COLORS } from "../../components/admin/analytics/VictoryAnalyticsCharts";

type AnalyticsTab = "tickets" | "projects";
const PERIODS: { key: AnalyticsPeriod; label: string; subtitle: string }[] = [
  { key: "monthly", label: "Monthly", subtitle: "Created vs. closed — last 6 months" },
  { key: "quarterly", label: "Quarterly", subtitle: "Created vs. closed — last 8 quarters" },
  { key: "yearly", label: "Yearly", subtitle: "Created vs. closed — last 5 years" },
];
function Switcher<T extends string>({ options, selected, onChange }: { options: { label: string; value: T }[]; selected: T; onChange: (value: T) => void }) {
  return (
    <View style={styles.switcher}>
      {options.map((option) => {
        const selectedOption = selected === option.value;
        return (
          <TouchableOpacity key={option.value} activeOpacity={0.75} onPress={() => onChange(option.value)} style={[styles.switchButton, selectedOption && styles.switchButtonSelected]}>
            <Text style={[styles.switchText, selectedOption && styles.switchTextSelected]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
function VolumePeriodSelector({ value, onChange }: { value: AnalyticsPeriod; onChange: (value: AnalyticsPeriod) => void }) {
  return (
    <View style={styles.periodSelector}>
      {PERIODS.map((option) => (
        <TouchableOpacity key={option.key} onPress={() => onChange(option.key)} activeOpacity={0.75} style={[styles.periodButton, value === option.key && styles.periodSelected]}>
          <Text style={[styles.periodText, value === option.key && styles.periodTextSelected]}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const counter = useRef(0);
  const [tab, setTab] = useState<AnalyticsTab>("tickets");
  const [ticketPeriod, setTicketPeriod] = useState<AnalyticsPeriod>("monthly");
  const [projectPeriod, setProjectPeriod] = useState<AnalyticsPeriod>("monthly");
  const [ticketData, setTicketData] = useState<TicketAnalyticsResponse | null>(null);
  const [projectData, setProjectData] = useState<ProjectAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    const current = ++counter.current;
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [ticketResult, projectResult] = await Promise.allSettled([fetchTicketAnalytics(), fetchProjectAnalytics()]);
      if (counter.current !== current) return;
      if (ticketResult.status === "fulfilled") setTicketData(ticketResult.value);
      if (projectResult.status === "fulfilled") setProjectData(projectResult.value);
      setError(ticketResult.status === "rejected" && projectResult.status === "rejected" ? "Unable to load analytics. Check your connection and try again." : null);
    } finally {
      if (counter.current === current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
    return () => { counter.current += 1; };
  }, [load]));

  const currentData = tab === "tickets" ? ticketData : projectData;
  const noData = !currentData;
  const currentPeriod = tab === "tickets" ? ticketPeriod : projectPeriod;
  const changePeriod = tab === "tickets" ? setTicketPeriod : setProjectPeriod;
  const subtitle = PERIODS.find((p) => p.key === currentPeriod)?.subtitle ?? "";

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <StatusBar style="dark" />
      <BackHeader title="Analytics" onBackPress={() => router.back()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={COLORS.navigationActive} />}>
        <Text style={styles.pageTitle}>Analytics</Text>
        <Text style={styles.pageSubtitle}>Track support performance across ticket lifecycles with visual reports.</Text>
        <Switcher<AnalyticsTab> options={[{ label: "Tickets", value: "tickets" }, { label: "Projects", value: "projects" }]} selected={tab} onChange={setTab} />
        {loading && noData ? (
          <View style={styles.message}><ActivityIndicator color={COLORS.navigationActive} /><Text style={styles.messageText}>Loading analytics...</Text></View>
        ) : noData ? (
          <View style={styles.message}>
            <Ionicons name="alert-circle-outline" size={27} color={COLORS.textNeutral} />
            <Text style={styles.messageText}>{error ?? `Unable to load ${tab} analytics.`}</Text>
            <TouchableOpacity onPress={() => void load()}><Text style={styles.retry}>Try Again</Text></TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{tab === "tickets" ? "Ticket Analytics" : "Project Analytics"}</Text>
            <Text style={styles.sectionSubtitle}>{tab === "tickets" ? "Support performance across ticket lifecycle dimensions." : "Track project delivery performance across lifecycle dimensions."}</Text>
            <AnalyticsChartCard title={tab === "tickets" ? "Ticket Volume" : "Project Volume"} subtitle={subtitle}>
              <VolumePeriodSelector value={currentPeriod} onChange={changePeriod} />
              <VolumeChart data={currentData[currentPeriod]} />
            </AnalyticsChartCard>
            {tab === "tickets" && ticketData ? (
              <>
                <AnalyticsChartCard title="Tickets by Call Type" subtitle="All-time distribution">
                  <CategoryBarChart data={ticketData.byCallType.map((r) => ({ label: r.callType, value: r.count }))} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Tickets by Employee" subtitle="Pending, in progress, and closed per assignee">
                  <EmployeeStackedChart data={ticketData.byEmployee} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Tickets by Priority" subtitle="All-time distribution">
                  <DonutChart data={ticketData.byPriority.map((r) => ({ label: r.priority, value: r.count }))} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Tickets by Status" subtitle="Current snapshot">
                  <DonutChart data={ticketData.byStatus.map((r) => ({ label: r.status, value: r.count }))} colors={[ANALYTICS_COLORS.status[0], ANALYTICS_COLORS.status[1], ANALYTICS_COLORS.status[2]]} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Tickets by Mode" subtitle="Which intake channel is busiest — all-time">
                  <DonutChart data={ticketData.byMode.map((r) => ({ label: r.mode, value: r.count }))} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Internal vs External" subtitle="All-time split">
                  <DonutChart data={ticketData.byInternalTag.map((r) => ({ label: r.internalTag, value: r.count }))} />
                </AnalyticsChartCard>
              </>
            ) : tab === "projects" && projectData ? (
              <>
                <AnalyticsChartCard title="Projects by Account Manager" subtitle="All-time distribution">
                  <CategoryBarChart data={projectData.byAccountManager.map((r) => ({ label: r.accountManager, value: r.count }))} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Projects by Employee" subtitle="Pending, in progress, and closed per assignee">
                  <EmployeeStackedChart data={projectData.byEmployee} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Projects by Priority" subtitle="All-time distribution">
                  <DonutChart data={projectData.byPriority.map((r) => ({ label: r.priority, value: r.count }))} />
                </AnalyticsChartCard>
                <AnalyticsChartCard title="Projects by Status" subtitle="Current snapshot">
                  <DonutChart data={projectData.byStatus.map((r) => ({ label: r.status, value: r.count }))} colors={[ANALYTICS_COLORS.status[0], ANALYTICS_COLORS.status[1], ANALYTICS_COLORS.status[2]]} />
                </AnalyticsChartCard>
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 15, paddingTop: 18, paddingBottom: 40 },
  pageTitle: { fontSize: 19, fontWeight: "700", color: COLORS.textPrimary },
  pageSubtitle: { fontSize: 11, lineHeight: 17, color: COLORS.textNeutral, marginTop: 4, marginBottom: 15 },
  switcher: { flexDirection: "row", backgroundColor: COLORS.white, borderColor: COLORS.border, borderWidth: 1, borderRadius: 11, padding: 3, marginBottom: 18 },
  switchButton: { flex: 1, alignItems: "center", justifyContent: "center", minHeight: 35, borderRadius: 8 },
  switchButtonSelected: { backgroundColor: COLORS.navigationActive },
  switchText: { color: COLORS.textSecondary, fontWeight: "600", fontSize: 11 },
  switchTextSelected: { color: COLORS.white },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },
  sectionSubtitle: { marginTop: 3, marginBottom: 14, fontSize: 10, color: COLORS.textNeutral, lineHeight: 15 },
  periodSelector: { flexDirection: "row", alignSelf: "flex-end", gap: 4, marginBottom: 14 },
  periodButton: { borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 8 },
  periodSelected: { backgroundColor: COLORS.navigationActive, borderColor: COLORS.navigationActive },
  periodText: { fontSize: 9, fontWeight: "600", color: COLORS.textSecondary },
  periodTextSelected: { color: COLORS.white },
  message: { minHeight: 220, justifyContent: "center", alignItems: "center", gap: 10 },
  messageText: { textAlign: "center", fontSize: 12, color: COLORS.textSecondary },
  retry: { fontSize: 12, fontWeight: "700", color: COLORS.navigationActive },
});

import React, {
  useMemo,
  useState,
} from "react";

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BarChart,
  LineChart,
  PieChart,
} from "react-native-gifted-charts";

import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import AnalyticsChartCard from "../../components/analytics/AnalyticsChartCard";
import AnalyticsLegend from "../../components/analytics/AnalyticsLegend";

import {
  temporaryAnalyticsData,
} from "../../data/analytics";

import type {
  AnalyticsPeriod,
  DistributionDataPoint,
  EmployeeAnalyticsDataPoint,
  VolumeDataPoint,
} from "../../types/analytics";

type AnalyticsTab =
  | "tickets"
  | "projects";

const COLORS = {
  primary: "#3729AD",
  blue: "#134581",
  green: "#016144",
  amber: "#963B00",
  red: "#9E0913",

  lightBlue: "#7DA7D9",
  lightPurple: "#9D94E8",
  lightGreen: "#7CBDA9",
};

export default function AnalyticsScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState<AnalyticsTab>("tickets");

  const [period, setPeriod] =
    useState<AnalyticsPeriod>("monthly");

  const chartWidth = useMemo(() => {
    return Math.max(
      Dimensions.get("window").width - 100,
      250
    );
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color="#2a2a2b"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Analytics
        </Text>

        <TouchableOpacity
          style={styles.userBadge}
          activeOpacity={0.7}
          onPress={() =>
            router.push("/home/account")
          }
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              SH
            </Text>
          </View>

          <Text style={styles.roleText}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>
          Analytics
        </Text>

        <Text style={styles.pageSubtitle}>
          Track support performance across ticket
          lifecycles with visual reports.
        </Text>

        {/* Main Tabs */}

        <View style={styles.tabs}>
          <TabButton
            label="Tickets"
            active={activeTab === "tickets"}
            onPress={() =>
              setActiveTab("tickets")
            }
          />

          <TabButton
            label="Projects"
            active={activeTab === "projects"}
            onPress={() =>
              setActiveTab("projects")
            }
          />
        </View>

        {activeTab === "tickets" ? (
          <TicketAnalytics
            chartWidth={chartWidth}
            period={period}
            onPeriodChange={setPeriod}
          />
        ) : (
          <ProjectAnalytics
            chartWidth={chartWidth}
            period={period}
            onPeriodChange={setPeriod}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


function TicketAnalytics({
  chartWidth,
  period,
  onPeriodChange,
}: {
  chartWidth: number;
  period: AnalyticsPeriod;
  onPeriodChange: (
    value: AnalyticsPeriod
  ) => void;
}) {
  const data =
    temporaryAnalyticsData.tickets;

  return (
    <View>
      <Text style={styles.sectionTitle}>
        Ticket Analytics
      </Text>

      <Text style={styles.sectionSubtitle}>
        Support performance across ticket
        lifecycle dimensions.
      </Text>

      <VolumeChart
        title="Ticket Volume"
        subtitle="Created vs. closed"
        data={data.volume}
        width={chartWidth}
        period={period}
        onPeriodChange={onPeriodChange}
      />

      <DistributionBarChart
        title="Tickets by Call Type"
        subtitle="All-time distribution"
        data={data.byCallType}
        width={chartWidth}
      />

      <EmployeeChart
        title="Tickets by Employee"
        subtitle="Pending, in progress, and closed per assignee"
        data={data.byEmployee}
        width={chartWidth}
      />

      <DistributionDonut
        title="Tickets by Priority"
        subtitle="All-time distribution"
        data={data.byPriority}
      />

      <DistributionDonut
        title="Tickets by Status"
        subtitle="Current snapshot"
        data={data.byStatus}
      />

      <DistributionDonut
        title="Tickets by Mode"
        subtitle="Which intake channel is busiest — all-time"
        data={data.byMode}
      />

      <DistributionDonut
        title="Internal vs External"
        subtitle="All-time split"
        data={data.internalVsExternal}
      />
    </View>
  );
}


function ProjectAnalytics({
  chartWidth,
  period,
  onPeriodChange,
}: {
  chartWidth: number;
  period: AnalyticsPeriod;
  onPeriodChange: (
    value: AnalyticsPeriod
  ) => void;
}) {
  const data =
    temporaryAnalyticsData.projects;

  return (
    <View>
      <Text style={styles.sectionTitle}>
        Project Analytics
      </Text>

      <Text style={styles.sectionSubtitle}>
        Track project delivery performance across
        the same lifecycle dimensions.
      </Text>

      <VolumeChart
        title="Project Volume"
        subtitle="Created vs. closed"
        data={data.volume}
        width={chartWidth}
        period={period}
        onPeriodChange={onPeriodChange}
      />

      <DistributionBarChart
        title="Projects by Account Manager"
        subtitle="All-time distribution"
        data={data.byAccountManager}
        width={chartWidth}
      />

      <EmployeeChart
        title="Projects by Employee"
        subtitle="Pending, in progress, and closed per assignee"
        data={data.byEmployee}
        width={chartWidth}
      />

      <DistributionDonut
        title="Projects by Priority"
        subtitle="All-time distribution"
        data={data.byPriority}
      />

      <DistributionDonut
        title="Projects by Status"
        subtitle="Current snapshot"
        data={data.byStatus}
      />
    </View>
  );
}


function VolumeChart({
  title,
  subtitle,
  data,
  width,
  period,
  onPeriodChange,
}: {
  title: string;
  subtitle: string;
  data: VolumeDataPoint[];
  width: number;
  period: AnalyticsPeriod;
  onPeriodChange: (
    value: AnalyticsPeriod
  ) => void;
}) {
  const createdData = data.map((item) => ({
    value: item.created,
    label: item.label,
  }));

  const closedData = data.map((item) => ({
    value: item.closed,
  }));

  return (
    <AnalyticsChartCard
      title={title}
      subtitle={subtitle}
    >
      <PeriodSelector
        value={period}
        onChange={onPeriodChange}
      />

      <View style={styles.chartArea}>
        <LineChart
          data={createdData}
          data2={closedData}
          width={width}
          height={190}
          curved
          thickness={2}
          thickness2={2}
          color1={COLORS.primary}
          color2={COLORS.green}
          dataPointsColor1={COLORS.primary}
          dataPointsColor2={COLORS.green}
          hideRules
          yAxisColor="#DCE4ED"
          xAxisColor="#DCE4ED"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={
            styles.axisText
          }
          noOfSections={4}
          initialSpacing={10}
          endSpacing={10}
        />
      </View>

      <AnalyticsLegend
        items={[
          {
            label: "Created",
            color: COLORS.primary,
          },
          {
            label: "Closed",
            color: COLORS.green,
          },
        ]}
      />
    </AnalyticsChartCard>
  );
}


function DistributionBarChart({
  title,
  subtitle,
  data,
  width,
}: {
  title: string;
  subtitle: string;
  data: DistributionDataPoint[];
  width: number;
}) {
  const barData = data.map(
    (item, index) => ({
      value: item.value,
      label: shortenLabel(item.label),
      frontColor:
        index % 2 === 0
          ? COLORS.blue
          : COLORS.primary,
    })
  );

  return (
    <AnalyticsChartCard
      title={title}
      subtitle={subtitle}
    >
      <View style={styles.chartArea}>
        <BarChart
          data={barData}
          width={width}
          height={190}
          barWidth={22}
          spacing={18}
          roundedTop
          hideRules
          yAxisColor="#DCE4ED"
          xAxisColor="#DCE4ED"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={
            styles.smallAxisText
          }
          noOfSections={4}
          initialSpacing={10}
          endSpacing={10}
        />
      </View>
    </AnalyticsChartCard>
  );
}


function EmployeeChart({
  title,
  subtitle,
  data,
  width,
}: {
  title: string;
  subtitle: string;
  data: EmployeeAnalyticsDataPoint[];
  width: number;
}) {
  const stackData = data.map((item) => ({
    label: shortenLabel(
      item.employeeName
    ),

    stacks: [
      {
        value: item.closed,
        color: COLORS.green,
      },
      {
        value: item.inProgress,
        color: COLORS.blue,
      },
      {
        value: item.pending,
        color: COLORS.amber,
      },
    ],
  }));

  return (
    <AnalyticsChartCard
      title={title}
      subtitle={subtitle}
    >
      <View style={styles.chartArea}>
        <BarChart
          stackData={stackData}
          width={width}
          height={200}
          barWidth={30}
          spacing={24}
          hideRules
          yAxisColor="#DCE4ED"
          xAxisColor="#DCE4ED"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={
            styles.smallAxisText
          }
          noOfSections={4}
          initialSpacing={10}
          endSpacing={10}
        />
      </View>

      <AnalyticsLegend
        items={[
          {
            label: "Closed",
            color: COLORS.green,
          },
          {
            label: "In Progress",
            color: COLORS.blue,
          },
          {
            label: "Pending",
            color: COLORS.amber,
          },
        ]}
      />
    </AnalyticsChartCard>
  );
}


function DistributionDonut({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: DistributionDataPoint[];
}) {
  const palette = [
    COLORS.primary,
    COLORS.blue,
    COLORS.green,
    COLORS.amber,
    COLORS.red,
    COLORS.lightBlue,
    COLORS.lightPurple,
    COLORS.lightGreen,
  ];

  const pieData = data.map(
    (item, index) => ({
      value: item.value,
      color:
        palette[index % palette.length],
    })
  );

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <AnalyticsChartCard
      title={title}
      subtitle={subtitle}
    >
      <View style={styles.donutContainer}>
        <PieChart
          data={pieData}
          donut
          radius={78}
          innerRadius={53}
          centerLabelComponent={() => (
            <View
              style={
                styles.donutCenter
              }
            >
              <Text
                style={
                  styles.donutTotal
                }
              >
                {total}
              </Text>

              <Text
                style={
                  styles.donutTotalLabel
                }
              >
                Total
              </Text>
            </View>
          )}
        />
      </View>

      <AnalyticsLegend
        items={data.map(
          (item, index) => ({
            label: `${item.label} (${item.value})`,
            color:
              palette[
                index % palette.length
              ],
          })
        )}
      />
    </AnalyticsChartCard>
  );
}


function PeriodSelector({
  value,
  onChange,
}: {
  value: AnalyticsPeriod;
  onChange: (
    value: AnalyticsPeriod
  ) => void;
}) {
  const periods: {
    label: string;
    value: AnalyticsPeriod;
  }[] = [
    {
      label: "Monthly",
      value: "monthly",
    },
    {
      label: "Quarterly",
      value: "quarterly",
    },
    {
      label: "Yearly",
      value: "yearly",
    },
  ];

  return (
    <View style={styles.periodSelector}>
      {periods.map((period) => {
        const active =
          period.value === value;

        return (
          <TouchableOpacity
            key={period.value}
            activeOpacity={0.7}
            style={[
              styles.periodButton,
              active &&
                styles.periodButtonActive,
            ]}
            onPress={() =>
              onChange(period.value)
            }
          >
            <Text
              style={[
                styles.periodText,
                active &&
                  styles.periodTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.tab,
        active && styles.activeTab,
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text
        style={[
          styles.tabText,
          active && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function shortenLabel(
  value: string
) {
  if (value.length <= 10) {
    return value;
  }

  return `${value.slice(0, 8)}…`;
}


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },

  header: {
    height: 60,
    backgroundColor: "#FFFFFF",

    borderBottomWidth: 1,
    borderBottomColor: "#DCE4ED",

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 36,
    height: 36,

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 11,

    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    marginLeft: 12,

    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },

  userBadge: {
    marginLeft: "auto",

    height: 32,

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 16,

    paddingLeft: 4,
    paddingRight: 10,

    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,

    backgroundColor: "#2a2a2b",

    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  roleText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#2a2a2b",
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#000000",
  },

  pageSubtitle: {
    marginTop: 5,

    fontSize: 11,
    lineHeight: 16,
    color: "#2a2a2b",
  },

  tabs: {
    marginTop: 18,
    marginBottom: 20,

    height: 42,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 11,

    padding: 3,

    flexDirection: "row",
  },

  tab: {
    flex: 1,

    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: "#3729AD",
  },

  tabText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2a2a2b",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000000",
  },

  sectionSubtitle: {
    marginTop: 3,
    marginBottom: 14,

    fontSize: 10,
    lineHeight: 14,
    color: "#2a2a2b",
  },

  chartArea: {
    overflow: "hidden",
  },

  axisText: {
    fontSize: 8,
    color: "#2a2a2b",
  },

  smallAxisText: {
    fontSize: 7,
    color: "#2a2a2b",
  },

  periodSelector: {
    marginBottom: 16,

    alignSelf: "flex-end",

    flexDirection: "row",

    borderWidth: 1,
    borderColor: "#DCE4ED",
    borderRadius: 8,

    padding: 2,
  },

  periodButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 6,
  },

  periodButtonActive: {
    backgroundColor: "#3729AD",
  },

  periodText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#2a2a2b",
  },

  periodTextActive: {
    color: "#FFFFFF",
  },

  donutContainer: {
    minHeight: 180,

    alignItems: "center",
    justifyContent: "center",
  },

  donutCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  donutTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },

  donutTotalLabel: {
    marginTop: 1,

    fontSize: 8,
    color: "#2a2a2b",
  },
});
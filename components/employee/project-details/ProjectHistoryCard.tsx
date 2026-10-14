
import React from "react";

import {
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../../../constants/colors";
import type { ProjectStatus } from "../../../types/project";

export type ProjectHistoryItem = {
    id: string;
    label: string;
    timestamp: string;
};

type ProjectHistoryCardProps = {
    history?: ProjectHistoryItem[];
    currentStatus: ProjectStatus;
};

export default function ProjectHistoryCard({
    history = [],
    currentStatus,
}: ProjectHistoryCardProps) {

    return (
        <View style={styles.card}>
            {/* HISTORY HEADER */}
            <View style={styles.headingRow}>
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="calendar-outline"
                        size={15}
                        color={COLORS.success}
                    />
                </View>

                <Text style={styles.title}>
                    HISTORY
                </Text>
            </View>

            {/* PROJECT HISTORY TIMELINE */}
            {history.length === 0 ? (
                <Text style={styles.emptyText}>
                    No history available.
                </Text>
            ) : (
                <View style={styles.timeline}>
                    {history.map((item, index) => {
                        const normalizedLabel = item.label.trim().toLowerCase();

                        const dotIsGreen =
                            normalizedLabel === "closed" ||
                            normalizedLabel === "project created";

                        return (
                            <View
                                key={item.id}
                                style={styles.historyRow}
                            >
                                <View style={styles.timelineColumn}>
                                    <View
                                        style={[
                                            styles.timelineDot,
                                            dotIsGreen
                                                ? styles.greenDot
                                                : styles.greyDot,
                                        ]}
                                    />

                                    {index < history.length - 1 && (
                                        <View
                                            style={[
                                                styles.timelineLine,
                                                styles.greyLine,
                                            ]}
                                        />
                                    )}
                                </View>

                                <View style={styles.historyContent}>
                                    <Text
                                        style={styles.historyLabel}
                                        selectable
                                    >
                                        {item.label}
                                    </Text>

                                    <Text
                                        style={styles.historyDate}
                                        selectable
                                    >
                                        {item.timestamp}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        padding: 16,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    headingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        marginBottom: 14,
    },

    iconContainer: {
        width: 25,
        height: 25,
        borderRadius: 7,
        backgroundColor: COLORS.statusClosedBackground,
        alignItems: "center",
        justifyContent: "center",
    },

    title: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.8,
        color: COLORS.textPrimary,
    },

    timeline: {
        marginTop: 2,
    },

    historyRow: {
        minHeight: 30,
        flexDirection: "row",
    },

    timelineColumn: {
        width: 20,
        paddingTop: 2,
        alignItems: "center",
    },

    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
    },

    greenDot: {
        backgroundColor: COLORS.activeStatus,
        borderColor: COLORS.statusClosedBackground,
    },

    greyDot: {
        backgroundColor: COLORS.textMuted,
        borderColor: COLORS.borderSoft,
    },

    timelineLine: {
        width: 2,
        flex: 1,
    },

    greenLine: {
        backgroundColor: COLORS.closedBorder,
    },

    greyLine: {
        backgroundColor: COLORS.border,
    },

    historyContent: {
        flex: 1,
        paddingLeft: 8,
        paddingBottom: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    historyLabel: {
        flex: 1,
        fontSize: 12.5,
        fontWeight: "400",
        color: COLORS.black,
    },

    historyDate: {
        fontSize: 10.5,
        color: COLORS.textLight,
        textAlign: "right",
    },

    emptyText: {
        fontSize: 10.5,
        color: COLORS.textMuted,
    },
});

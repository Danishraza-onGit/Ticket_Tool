
import React, { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fetchTicket } from "../../../api/tickets";
import { COLORS } from "../../../constants/colors";
import type { InventoryItem } from "../../../types/inwardOutward";
import type { Ticket, TicketPriority } from "../../../types/ticket";

type Props = {
    item: InventoryItem;
    onPressTicket: (item: InventoryItem) => void;
    onUpdate: (item: InventoryItem) => void;
};

const PRIORITY_COLORS = {
    P1: {
        background: COLORS.priorityP1Background,
        text: COLORS.priorityP1Text,
        border: COLORS.priorityP1Border,
    },
    P2: {
        background: COLORS.priorityP2Background,
        text: COLORS.priorityP2Text,
        border: COLORS.priorityP2Border,
    },
    P3: {
        background: COLORS.priorityP3Background,
        text: COLORS.priorityP3Text,
        border: COLORS.priorityP3Border,
    },
    P4: {
        background: COLORS.priorityP4Background,
        text: COLORS.priorityP4Text,
        border: COLORS.priorityP4Border,
    },
} satisfies Record<
    TicketPriority,
    {
        background: string;
        text: string;
        border: string;
    }
>;

const INVENTORY_STATUS_COLORS = {
    "Pending Inward": {
        background: COLORS.statusPendingBackground,
        text: COLORS.statusPendingText,
        border: COLORS.statusPendingBorder,
    },
    "In-House": {
        background: COLORS.statusClosedBackground,
        text: COLORS.statusClosedText,
        border: COLORS.statusClosedBorder,
    },
    Outsourced: {
        background: COLORS.statusInProgressBackground,
        text: COLORS.statusInProgressText,
        border: COLORS.statusInProgressBorder,
    },
    "Returned to Customer": {
        background: COLORS.statusClosedBackground,
        text: COLORS.statusClosedText,
        border: COLORS.statusClosedBorder,
    },
} as const;

const truncateText = (
    value: string | null | undefined,
    maxLength: number
): string => {
    const text = value?.trim() ?? "";

    if (!text) return "";

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength)}...`;
};

function formatDate(value?: string | null): string {
    if (!value) return "—";

    const day = value.slice(0, 10);
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);

    if (!match) return "—";

    return `${match[3]}/${match[2]}/${match[1]}`;
}

function formatDateTime(value?: string | null): string {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return formatDate(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function InventoryTicketCard({
    item,
    onPressTicket,
    onUpdate,
}: Props) {
    const [ticket, setTicket] = useState<Ticket | null>(null);

    // Inventory listing does not contain priority, problem or
    // ticket timestamps. Retrieve them from the existing ticket API.
    useEffect(() => {
        let active = true;

        fetchTicket(item.srNo)
            .then((detail) => {
                if (active) {
                    setTicket(detail.ticket);
                }
            })
            .catch((error) => {
                if (active) {
                    console.log(
                        "Inventory ticket detail unavailable:",
                        item.srNo,
                        error
                    );
                }
            });

        return () => {
            active = false;
        };
    }, [item.srNo]);

    const completed = Boolean(item.outwardDate);

    const inventoryStatus = completed
        ? "Returned to Customer"
        : !item.inwardDate
            ? "Pending Inward"
            : item.repairLocation === "Outsourced"
                ? "Outsourced"
                : "In-House";

    const statusLabel =
        inventoryStatus === "In-House"
            ? "Inward Completed"
            : inventoryStatus;

    const statusColors =
        INVENTORY_STATUS_COLORS[inventoryStatus];

    const priorityColors = ticket?.priority
        ? PRIORITY_COLORS[ticket.priority]
        : null;

    // const pending = !item.inwardDate;


    // const statusColor = completed
    //     ? "#047857"
    //     : pending
    //         ? "#B45309"
    //         : "#047857";

    // const statusBackground = completed
    //     ? "#E5F8EF"
    //     : pending
    //         ? "#FFF8E8"
    //         : "#E5F8EF";

    // const statusBorder = completed
    //     ? "#A7E8C5"
    //     : pending
    //         ? "#F8D88A"
    //         : "#A7E8C5";

    const modelAndSerial = [
        truncateText(item.model, 15),
        truncateText(item.serialNumber, 10),
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <View style={styles.card}>
            {/* Top: ticket number and created date */}
            <View style={styles.topRow}>
                <Pressable
                    onPress={() => onPressTicket(item)}
                    style={styles.ticketBadge}
                    accessibilityRole="button"
                    accessibilityLabel={`Open ticket ${item.ticketNo}`}
                >
                    <Text style={styles.ticketNumber}>
                        #{item.ticketNo}
                    </Text>
                </Pressable>

                <View style={styles.dateGroup}>
                    <Ionicons
                        name="calendar-outline"
                        size={12}
                        color={COLORS.textNeutral}
                    />
                    <Text style={styles.dateText}>
                        {formatDate(ticket?.ticketDate)}
                    </Text>
                </View>
            </View>

            {/* Company and status */}
            <View style={styles.companyRow}>
                <View style={styles.companyDetails}>
                    <Text style={styles.companyName} numberOfLines={1}>
                        {item.companyName}
                    </Text>

                    <Text style={styles.modelText} numberOfLines={1}>
                        {modelAndSerial || "Unspecified Model · None recorded"}
                    </Text>
                </View>

                <View style={styles.badgeGroup}>
                    {ticket?.priority && priorityColors && (
                        <View
                            style={[
                                styles.priorityBadge,
                                {
                                    backgroundColor: priorityColors.background,
                                    borderColor: priorityColors.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.priorityText,
                                    { color: priorityColors.text },
                                ]}
                            >
                                {ticket.priority}
                            </Text>
                        </View>
                    )}

                    <View
                        style={[
                            styles.statusBadge,
                            {
                                backgroundColor: statusColors.background,
                                borderColor: statusColors.border,
                            },
                        ]}
                    >
                        <Text
                            numberOfLines={2}
                            style={[
                                styles.statusText,
                                { color: statusColors.text },
                            ]}
                        >
                            {statusLabel}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Inward and outward dates */}
            <View style={styles.movementRow}>
                <View style={styles.movementColumn}>
                    <Text style={styles.movementLabel}>
                        INWARD
                    </Text>

                    <Text
                        style={[
                            styles.movementValue,
                            !item.inwardDate && styles.pendingText,
                        ]}
                    >
                        {item.inwardDate
                            ? formatDateTime(item.inwardDate)
                            : "Pending Inward"}
                    </Text>
                </View>

                <View style={styles.verticalDivider} />

                <View style={styles.movementColumn}>
                    <Text style={styles.movementLabel}>
                        OUTWARD
                    </Text>

                    <Text style={styles.movementValue}>
                        {item.outwardDate
                            ? formatDateTime(item.outwardDate)
                            : item.inwardDate
                                ? "Pending"
                                : "—"}
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* Issue details */}
            <View style={styles.issueContainer}>
                <Text style={styles.issueTitle}>
                    ISSUE DETAILS
                </Text>

                <Text style={styles.issueText}>
                    {truncateText(ticket?.problem, 110) ||
                        "Issue details are not available."}
                </Text>
            </View>

            <View style={styles.footerDivider} />

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.updatedText} numberOfLines={1}>
                    Last Updated: {formatDate(ticket?.updatedAt)}
                </Text>

                <Pressable
                    onPress={() => onUpdate(item)}
                    disabled={completed}
                    style={[
                        styles.updateButton,
                        completed && styles.completedButton,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                        completed
                            ? "Inventory completed"
                            : `Update inventory for ${item.ticketNo}`
                    }
                >
                    <Ionicons
                        name={
                            completed
                                ? "checkmark-circle-outline"
                                : "settings-outline"
                        }
                        size={13}
                        color={
                            completed
                                ? COLORS.textSubtle
                                : COLORS.white
                        }
                    />

                    <Text
                        style={[
                            styles.updateButtonText,
                            completed && styles.completedButtonText,
                        ]}
                    >
                        {completed ? "Completed" : "Update"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
    
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 12,
        padding: 13,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    ticketBadge: {
        backgroundColor: COLORS.ticketNumberBackground,
        borderRadius: 7,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },

    ticketNumber: {
        color: COLORS.textPrimary,
        fontWeight: "800",
        fontSize: 11,
        letterSpacing: 0.2,
    },

    dateGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    dateText: {
        fontSize: 10,
        color: COLORS.textSubtle,
    },

    companyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 8,
        marginBottom: 10,
    },

    companyDetails: {
        flex: 1,
        minWidth: 0,
        gap: 5,
    },

    companyName: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.textPrimary,
    },

    modelText: {
        fontSize: 10,
        color: COLORS.textPrimary,
        lineHeight: 10,
    },

    badgeGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 5,
        maxWidth: "57%",
    },

    statusBadge: {
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    statusText: {
        fontSize: 10,
        fontWeight: "600",
        textAlign: "center",
    },

    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginBottom: 8,
    },

    movementRow: {
        flexDirection: "row",
        minHeight: 43,
        marginBottom: 8,
    },

    movementColumn: {
        flex: 1,
        gap: 6,
    },

    verticalDivider: {
        width: 1,
        backgroundColor: COLORS.divider,
        marginHorizontal: 14,
    },

    movementLabel: {
        fontSize: 9,
        fontWeight: "800",
        letterSpacing: 1,
        color: COLORS.textPrimary,
    },

    movementValue: {
        fontSize: 11,
        color: COLORS.textSubtle,
        lineHeight: 16,
    },

    pendingText: {
        color: COLORS.textSubtle,
        fontWeight: "600",
    },

    issueContainer: {
        borderLeftWidth: 2,
        borderLeftColor: COLORS.navigationActive,
        paddingLeft: 11,
        marginBottom: 8,
        gap: 6,
    },

    issueTitle: {
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.7,
        color: COLORS.textPrimary,
    },

    issueText: {
        fontSize: 11,
        lineHeight: 17,
        color: COLORS.textPrimary,
    },

    footerDivider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginBottom: 8,
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },

    updatedText: {
        flex: 1,
        fontSize: 10,
        color: COLORS.textPrimary,
    },

    updateButton: {
        minHeight: 34,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: COLORS.navigationActive,
        borderRadius: 8,
        paddingHorizontal: 13,
    },

    updateButtonText: {
        fontSize: 11,
        fontWeight: "700",
        color: COLORS.white,
    },

    completedButton: {
        backgroundColor: COLORS.searchButtonBackground,
        borderWidth: 1,
        borderColor: COLORS.searchButtonBackground,
    },

    completedButtonText: {
        color: COLORS.textSubtle,
    },

    priorityBadge: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 7,
        paddingVertical: 4,
    },

    priorityText: {
        fontSize: 10,
        fontWeight: "700",
    },

});

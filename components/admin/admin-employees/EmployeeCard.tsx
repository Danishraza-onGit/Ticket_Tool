import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Employee } from "../../../types/employee";
import { COLORS } from "@/constants/colors";

type EmployeeCardProps = {
    employee: Employee;
    expanded: boolean;
    onToggleExpand: () => void;
    onSendEmail: () => void;
    onDeactivate: () => void;
};

export default function EmployeeCard({
    employee,
    expanded,
    onToggleExpand,
    onSendEmail,
    onDeactivate,
}: EmployeeCardProps) {
    const isActive = employee.status === "Active";
    const isAdmin = employee.role === "Admin";

    return (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.mainContent}
                onPress={onToggleExpand}
                activeOpacity={0.8}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {employee.initials}
                    </Text>
                </View>

                <View style={styles.employeeInfo}>
                    <View style={styles.nameRow}>
                        <Text
                            style={styles.name}
                            numberOfLines={1}
                        >
                            {employee.fullName}
                        </Text>

                        {isAdmin && (
                            <View style={styles.adminBadge}>
                                <Text style={styles.adminBadgeText}>
                                    Admin
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text
                        style={styles.metaText}
                        numberOfLines={1}
                    >
                        @{employee.username} • {employee.role} •{" "}
                        {employee.team}
                    </Text>

                    <Text
                        style={styles.email}
                        numberOfLines={1}
                    >
                        {employee.email}
                    </Text>
                </View>

                <View style={styles.rightSection}>
                    <View
                        style={[
                            styles.statusBadge,
                            !isActive && styles.inactiveBadge,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                !isActive && styles.inactiveText,
                            ]}
                        >
                            {employee.status}
                        </Text>
                    </View>

                    <Ionicons
                        name={
                            expanded
                                ? "chevron-up"
                                : "chevron-down"
                        }
                        size={16}
                        color={COLORS.iconGrey}
                    />
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.expandedSection}>
                    <View style={styles.divider} />

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.secondaryAction}
                            onPress={onSendEmail}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="mail-outline"
                                size={15}
                                color={COLORS.white}
                            />

                            <Text style={styles.secondaryActionText}>
                                Send Email
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deactivateAction}
                            onPress={onDeactivate}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="ban-outline"
                                size={15}
                                color={COLORS.danger}
                            />

                            <Text style={styles.deactivateText}>
                                Deactivate
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 10,
        overflow: "hidden",
    },

    mainContent: {
        minHeight: 92,
        paddingHorizontal: 14,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: COLORS.avatarBackground,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.white,
    },

    employeeInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 8,
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    name: {
        flexShrink: 1,
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },

    adminBadge: {
        borderRadius: 6,
        backgroundColor: COLORS.inProgressBackground,
        borderWidth: 1,
        borderColor: COLORS.inProgressBorder,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },

    adminBadgeText: {
        fontSize: 8,
        fontWeight: "600",
        color: COLORS.statusInProgressText,
    },

    metaText: {
        marginTop: 4,
        fontSize: 9.5,
        color: COLORS.textPrimary,
    },

    email: {
        marginTop: 4,
        fontSize: 9.5,
        color: COLORS.textSecondary,
    },

    rightSection: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        alignSelf: "stretch",
        paddingVertical: 3,
    },

    statusBadge: {
        borderRadius: 10,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.activeStatus,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    statusText: {
        fontSize: 8.5,
        fontWeight: "600",
        color: COLORS.activeStatus,
    },

    inactiveBadge: {
        backgroundColor: COLORS.priorityP4Background,
        borderColor: COLORS.priorityP4Border,
    },

    inactiveText: {
        color: COLORS.priorityP4Text,
    },

    expandedSection: {
        paddingHorizontal: 14,
        paddingBottom: 13,
    },

    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginBottom: 12,
    },

    actions: {
        flexDirection: "row",
        gap: 10,
    },

    secondaryAction: {
        flex: 1.55,
        height: 38,
        borderRadius: 10,
        backgroundColor: COLORS.navigationActive,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,

        shadowColor: COLORS.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    secondaryActionText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.white,
    },

    deactivateAction: {
        flex: 1,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.danger,
        backgroundColor: COLORS.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    deactivateText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.danger,
    }
});
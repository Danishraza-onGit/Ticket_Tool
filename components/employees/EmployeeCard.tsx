import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Employee } from "../../types/employee";

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
                        color="#8A9BAE"
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
                                color="#FFFFFF"
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
                                color="#D83A3A"
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
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DCE4ED",
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
        backgroundColor: "#E8EEF5",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#52647B",
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
        color: "#16243A",
    },

    adminBadge: {
        borderRadius: 6,
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#BEDAFF",
        paddingHorizontal: 6,
        paddingVertical: 2,
    },

    adminBadgeText: {
        fontSize: 8,
        fontWeight: "600",
        color: "#1769E0",
    },

    metaText: {
        marginTop: 4,
        fontSize: 9.5,
        color: "#687B93",
    },

    email: {
        marginTop: 4,
        fontSize: 9.5,
        color: "#8A9BAE",
    },

    rightSection: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        alignSelf: "stretch",
        paddingVertical: 3,
    },

    statusBadge: {
        borderRadius: 10,
        backgroundColor: "#ECFDF5",
        borderWidth: 1,
        borderColor: "#A7F3D0",
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    statusText: {
        fontSize: 8.5,
        fontWeight: "600",
        color: "#059669",
    },

    inactiveBadge: {
        backgroundColor: "#F1F5F9",
        borderColor: "#DCE4ED",
    },

    inactiveText: {
        color: "#71849A",
    },

    expandedSection: {
        paddingHorizontal: 14,
        paddingBottom: 13,
    },

    divider: {
        height: 1,
        backgroundColor: "#E9EEF4",
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
        backgroundColor: "#103A76",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,

        shadowColor: "#000000",
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
        color: "#FFFFFF",
    },

    deactivateAction: {
        flex: 1,
        height: 38,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FFC7CD",
        backgroundColor: "#FFF4F5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
    },

    deactivateText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#F04455",
    }
});
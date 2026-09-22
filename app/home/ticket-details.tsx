import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    useLocalSearchParams,
    useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    temporaryCustomers,
} from "../../data/customer";

export default function TicketDetailsScreen() {
    const router = useRouter();

    const {
        customerId,
        ticketNo,
    } = useLocalSearchParams<{
        customerId?: string;
        ticketNo?: string;
    }>();

    const matchedCustomer = customerId
        ? temporaryCustomers.find(
            (item) => item.id === customerId
        )
        : temporaryCustomers.find((item) =>
            item.tickets.some(
                (ticket) =>
                    ticket.ticketNo === ticketNo
            )
        );

    const ticket =
        matchedCustomer?.tickets.find(
            (item) => item.ticketNo === ticketNo
        );

    const customer = matchedCustomer;

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={18}
                        color="#52647B"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Ticket Details
                </Text>

                <TouchableOpacity
                    style={styles.headerUserBadge}
                    onPress={() =>
                        router.push("/home/account")
                    }
                    activeOpacity={0.7}
                >
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerInitials}>
                            SH
                        </Text>
                    </View>

                    <Text style={styles.headerRole}>
                        Admin
                    </Text>
                </TouchableOpacity>
            </View>

            {!customer || !ticket ? (
                <View style={styles.notFound}>
                    <Ionicons
                        name="ticket-outline"
                        size={28}
                        color="#9AABBD"
                    />

                    <Text style={styles.notFoundTitle}>
                        Ticket details unavailable
                    </Text>

                    <Text style={styles.notFoundText}>
                        This ticket will be loaded from the API
                        when backend integration is connected.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.ticketHeading}>
                        <View style={styles.ticketHeadingText}>
                            <Text style={styles.eyebrow}>
                                TICKET
                            </Text>

                            <Text
                                style={styles.ticketNumber}
                                selectable
                            >
                                #{ticket.ticketNo}
                            </Text>
                        </View>

                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {ticket.status}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.problemCard}>
                        <View style={styles.sectionHeading}>
                            <Ionicons
                                name="chatbox-outline"
                                size={16}
                                color="#174F8A"
                            />

                            <Text style={styles.sectionTitle}>
                                Problem Description
                            </Text>
                        </View>

                        <Text style={styles.problemText}>
                            {ticket.problem}
                        </Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.sectionHeading}>
                            <Ionicons
                                name="person-outline"
                                size={16}
                                color="#174F8A"
                            />

                            <Text style={styles.sectionTitle}>
                                Customer Information
                            </Text>
                        </View>

                        <InfoRow
                            label="Company"
                            value={customer.company}
                            selectable
                        />

                        <InfoRow
                            label="Contact"
                            value={customer.contactName}
                            selectable
                        />

                        <InfoRow
                            label="Phone"
                            value={customer.contactNo}
                            selectable
                        />

                        <InfoRow
                            label="Email"
                            value={customer.email || "—"}
                            selectable
                        />

                        <InfoRow
                            label="Address"
                            value={customer.address || "—"}
                            selectable
                        />
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.sectionHeading}>
                            <Ionicons
                                name="ticket-outline"
                                size={16}
                                color="#174F8A"
                            />

                            <Text style={styles.sectionTitle}>
                                Ticket Information
                            </Text>
                        </View>

                        <InfoRow
                            label="Date"
                            value={ticket.date}
                        />

                        <InfoRow
                            label="Call Type"
                            value={ticket.callType}
                        />

                        <InfoRow
                            label="Priority"
                            value={ticket.priority}
                        />

                        <InfoRow
                            label="Status"
                            value={ticket.status}
                        />

                        <InfoRow
                            label="Assigned To"
                            value={ticket.assignedTo}
                        />

                        <InfoRow
                            label="Deadline"
                            value={ticket.deadline || "—"}
                        />
                    </View>

                    <View style={styles.futureNote}>
                        <Ionicons
                            name="information-circle-outline"
                            size={16}
                            color="#60748C"
                        />

                        <Text style={styles.futureNoteText}>
                            Additional ticket information, history,
                            assignment and remarks will be populated
                            when the API is integrated.
                        </Text>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

type InfoRowProps = {
    label: string;
    value: string;
    selectable?: boolean;
};

function InfoRow({
    label,
    value,
    selectable = false,
}: InfoRowProps) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
                {label}
            </Text>

            <Text
                style={styles.infoValue}
                selectable={selectable}
            >
                {value}
            </Text>
        </View>
    );
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
        borderBottomColor: "#E1E7EF",

        paddingHorizontal: 16,

        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: 36,
        height: 36,
        borderRadius: 11,

        borderWidth: 1,
        borderColor: "#DCE4ED",

        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        marginLeft: 12,

        fontSize: 16,
        fontWeight: "700",
        color: "#16243A",
    },

    headerUserBadge: {
        marginLeft: "auto",
        height: 32,
        borderRadius: 16,

        borderWidth: 1,
        borderColor: "#DCE4ED",

        backgroundColor: "#FFFFFF",

        paddingLeft: 4,
        paddingRight: 10,

        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    headerAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,

        backgroundColor: "#172238",

        alignItems: "center",
        justifyContent: "center",
    },

    headerInitials: {
        fontSize: 9,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    headerRole: {
        fontSize: 9,
        fontWeight: "600",
        color: "#52647B",
    },

    scrollView: {
        flex: 1,
    },

    content: {
        padding: 16,
        paddingBottom: 36,
    },

    ticketHeading: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    ticketHeadingText: {
        flex: 1,
    },

    eyebrow: {
        fontSize: 7.5,
        fontWeight: "700",
        letterSpacing: 0.7,
        color: "#8A99AA",
    },

    ticketNumber: {
        marginTop: 3,

        fontSize: 18,
        fontWeight: "700",
        color: "#16243A",
    },

    statusBadge: {
        borderRadius: 11,
        backgroundColor: "#D1FBE5",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

    statusText: {
        fontSize: 9,
        fontWeight: "700",
        color: "#016144",
    },

    problemCard: {
        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#DCE4ED",
        borderRadius: 13,

        padding: 14,
        marginBottom: 12,
    },

    infoCard: {
        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#DCE4ED",
        borderRadius: 13,

        padding: 14,
        marginBottom: 12,
    },

    sectionHeading: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#174F8A",
    },

    problemText: {
        fontSize: 11,
        lineHeight: 17,
        color: "#34455B",
    },

    infoRow: {
        paddingVertical: 9,

        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F6",
    },

    infoLabel: {
        fontSize: 8,
        fontWeight: "700",
        color: "#8A99AA",
    },

    infoValue: {
        marginTop: 4,

        fontSize: 10.5,
        lineHeight: 15,
        color: "#26364C",
    },

    futureNote: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,

        borderRadius: 11,
        backgroundColor: "#EDF3F9",

        padding: 12,
    },

    futureNoteText: {
        flex: 1,

        fontSize: 9.5,
        lineHeight: 14,
        color: "#60748C",
    },

    notFound: {
        flex: 1,

        paddingHorizontal: 40,

        alignItems: "center",
        justifyContent: "center",
    },

    notFoundTitle: {
        marginTop: 10,

        fontSize: 13,
        fontWeight: "700",
        color: "#26364C",
    },

    notFoundText: {
        marginTop: 6,

        textAlign: "center",

        fontSize: 10,
        lineHeight: 15,
        color: "#8396AD",
    },
});
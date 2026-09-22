import React, {
    useMemo,
    useState,
} from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomerCard from "../../components/customers/CustomerCard";
import CustomerSearchBar from "../../components/customers/CustomerSearchBar";

import CustomerDetailsModal from "../../components/customers/CustomerDetailsModal";

import {
    temporaryCustomers,
} from "../../data/customer";

import type {
    Customer,
    CustomerTicket,
} from "../../types/customer";


export default function CustomersScreen() {
    const router = useRouter();

    const [
        selectedCustomer,
        setSelectedCustomer,
    ] = useState<Customer | null>(null);

    const [searchText, setSearchText] =
        useState("");

    const filteredCustomers = useMemo(() => {
        const query = searchText
            .trim()
            .toLowerCase();

        if (!query) {
            return temporaryCustomers;
        }

        return temporaryCustomers.filter(
            (customer) =>
                customer.company
                    .toLowerCase()
                    .includes(query)
        );
    }, [searchText]);

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
                    Customers
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

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <CustomerSearchBar
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <View style={styles.customerList}>
                    {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(
                            (customer) => (
                                <CustomerCard
                                    key={customer.id}
                                    customer={customer}
                                    onCompanyPress={() =>
                                        setSelectedCustomer(customer)}
                                />
                            )
                        )
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="search-outline"
                                size={22}
                                color="#A2B0C0"
                            />

                            <Text style={styles.emptyText}>
                                No customers found.
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <CustomerDetailsModal
                visible={selectedCustomer !== null}
                customer={selectedCustomer}
                onClose={() =>
                    setSelectedCustomer(null)
                }
                onTicketPress={(ticket: CustomerTicket) => {
                    setSelectedCustomer(null);

                    router.push({
                        pathname: "/home/ticket-details",
                        params: {
                            customerId:
                                selectedCustomer?.id ?? "",
                            ticketNo: ticket.ticketNo,
                        },
                    });
                }}
            />
        </SafeAreaView>
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
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 32,
    },

    customerList: {
        marginTop: 12,
    },

    emptyState: {
        minHeight: 130,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: "#DCE4ED",
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },

    emptyText: {
        fontSize: 11,
        fontWeight: "500",
        color: "#7A8DA3",
    },
});
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
} from "react-native-safe-area-context";

import ActivityLogCard from "../../components/activity/ActivityLogCard";
import {
    temporaryActivityLogs,
} from "../../data/activity";

export default function ActivityLogScreen() {
    const router = useRouter();

    const handleReferencePress = (
        reference: string
    ) => {
        router.push({
            pathname: "/home/ticket-details",
            params: {
                ticketNo: reference,
            },
        });
    };


    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={["top"]}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color="#3729AD"
                    />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Activity Log
                </Text>

                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <FlatList
                data={temporaryActivityLogs}
                keyExtractor={(item) => item.id}
                contentContainerStyle={
                    styles.listContent
                }
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.intro}>
                        <Text style={styles.title}>
                            Activity Log
                        </Text>

                        <Text style={styles.subtitle}>
                            Track actions performed within the
                            ticketing system.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ActivityLogCard
                        activity={item}
                        onReferencePress={() =>
                            handleReferencePress(
                                item.reference
                            )
                        }
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F5F7FA",
    },

    header: {
        height: 58,
        paddingHorizontal: 16,

        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E2E6EC",

        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: 38,
        height: 38,
        borderRadius: 10,

        borderWidth: 1,
        borderColor: "#E2E6EC",
        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: "#000000",
    },

    headerSpacer: {
        width: 38,
    },

    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 30,
    },

    intro: {
        marginBottom: 14,
    },

    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000000",
    },

    subtitle: {
        marginTop: 4,
        fontSize: 11,
        lineHeight: 16,
        color: "#2a2a2b",
    },
});
import React from "react";
import BackHeader from "../../components/admin/navigation/BackHeader";
import {
    FlatList,
    StyleSheet,
    Text,
    // TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../../constants/colors";


// import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
    SafeAreaView,
} from "react-native-safe-area-context";

import ActivityLogCard from "../../components/admin/activity/ActivityLogCard";
import {
    temporaryActivityLogs,
} from "../../data/activity";

export default function ActivityLogScreen() {
    const router = useRouter();

    const handleReferencePress = (
        reference: string
    ) => {
        const ticketNo =
            reference.replace("#", "");

        router.push({
            pathname: "/home/ticket-details",
            params: {
                ticketNo,
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
            <BackHeader
                title="Activity Log"
                onBackPress={() => router.back()}
            />

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
        backgroundColor: COLORS.background,
    },

    header: {
        height: 58,
        paddingHorizontal: 16,

        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,

        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: 38,
        height: 38,
        borderRadius: 10,

        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,

        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textPrimary,
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
        color: COLORS.textPrimary,
    },

    subtitle: {
        marginTop: 4,
        fontSize: 11,
        lineHeight: 16,
        color: COLORS.textNeutral,
    },
});
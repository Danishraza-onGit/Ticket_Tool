
import React, {
    useCallback,
    useRef,
    useState,
} from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    useFocusEffect,
    useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "../../constants/colors";
import { fetchActivity } from "../../api/activity";
import { mapActivity } from "../../utils/activityMappers";
import type { ActivityLogItem } from "../../types/activity";

import BackHeader from "../../components/admin/navigation/BackHeader";
import ActivityLogCard from "../../components/admin/activity/ActivityLogCard";

const PAGE_SIZE = 12;

export default function ActivityLogScreen() {
    const router = useRouter();
    const requestId = useRef(0);
    const listRef = useRef<FlatList<ActivityLogItem>>(null);

    const [entries, setEntries] =
        useState<ActivityLogItem[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] =
        useState(false);
    const [error, setError] =
        useState<string | null>(null);

    const totalPages = Math.max(
        1,
        Math.ceil(total / PAGE_SIZE)
    );

    const loadActivity = useCallback(
        async (refreshing = false) => {
            const currentRequest = ++requestId.current;

            if (refreshing) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            setError(null);

            try {
                const response = await fetchActivity({
                    page,
                    pageSize: PAGE_SIZE,
                });

                if (currentRequest !== requestId.current) {
                    return;
                }

                setEntries(response.entries.map(mapActivity));
                setTotal(response.total);
            } catch (err) {
                if (currentRequest !== requestId.current) {
                    return;
                }

                console.error("Activity Log API error:", err);
                setError(
                    "Unable to load activity records. Please try again."
                );
            } finally {
                if (currentRequest === requestId.current) {
                    setIsLoading(false);
                    setIsRefreshing(false);
                }
            }
        },
        [page]
    );

    useFocusEffect(
        useCallback(() => {
            void loadActivity();

            return () => {
                requestId.current += 1;
            };
        }, [loadActivity])
    );


    const handleReferencePress = (
        activity: ActivityLogItem
    ) => {
        const srNo = activity.referenceSrNo;

        if (srNo === null) {
            return;
        }

        if (activity.referenceType === "ticket") {
            router.push({
                pathname: "/home/ticket-details",
                params: {
                    srNo: String(srNo),
                    ticketNo: activity.reference,
                },
            });
            return;
        }

        if (activity.referenceType === "project") {
            router.push({
                pathname: "/home/project-details",
                params: {
                    srNo: String(srNo),
                    projectSrNo: String(srNo),
                    projectNo: activity.reference,
                },
            });
        }
    };


    const handlePageChange = (nextPage: number) => {
        if (
            nextPage < 1 ||
            nextPage > totalPages ||
            nextPage === page
        ) {
            return;
        }

        setPage(nextPage);
        listRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
        });
    };

    return (
        <SafeAreaView
            style={styles.screen}
            edges={["top"]}
        >
            <StatusBar style="dark" />

            <BackHeader
                title="Activity Log"
                onBackPress={() => router.back()}
            />

            <FlatList
                ref={listRef}
                data={error ? [] : entries}
                keyExtractor={(item) => String(item.id)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => {
                            void loadActivity(true);
                        }}
                        tintColor={COLORS.navigationActive}
                        colors={[COLORS.navigationActive]}
                    />
                }
                ListHeaderComponent={
                    <View style={styles.intro}>
                        <Text style={styles.title}>
                            Activity Log
                        </Text>

                        <Text style={styles.subtitle}>
                            A complete timeline of actions performed
                            within the ticketing system.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <ActivityLogCard
                        activity={item}
                        onReferencePress={() =>
                            handleReferencePress(item)
                        }
                    />
                )}
                ListEmptyComponent={
                    isLoading ? (
                        <View style={styles.centerState}>
                            <ActivityIndicator
                                color={COLORS.navigationActive}
                            />

                            <Text style={styles.stateText}>
                                Loading activity...
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.centerState}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={25}
                                color={COLORS.danger}
                            />

                            <Text style={styles.stateText}>
                                {error}
                            </Text>

                            <TouchableOpacity
                                onPress={() => void loadActivity()}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.retryText}>
                                    Try Again
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="time-outline"
                                size={25}
                                color={COLORS.iconGrey}
                            />

                            <Text style={styles.emptyTitle}>
                                No activity found
                            </Text>

                            <Text style={styles.emptyDescription}>
                                System activity will appear here
                                when records are available.
                            </Text>
                        </View>
                    )
                }
                ListFooterComponent={
                    !isLoading && !error && total > 0 ? (
                        <View style={styles.footer}>
                            <Text style={styles.footerCount}>
                                Showing {entries.length} of {total} entries
                            </Text>

                            <View style={styles.pagination}>
                                <TouchableOpacity
                                    style={[
                                        styles.pageButton,
                                        page === 1 && styles.disabledButton,
                                    ]}
                                    disabled={page === 1}
                                    onPress={() =>
                                        handlePageChange(page - 1)
                                    }
                                >
                                    <Ionicons
                                        name="chevron-back"
                                        size={14}
                                        color={
                                            page === 1
                                                ? COLORS.textNeutral
                                                : COLORS.navigationActive
                                        }
                                    />
                                    <Text style={styles.pageButtonText}>
                                        Prev
                                    </Text>
                                </TouchableOpacity>

                                <Text style={styles.pageLabel}>
                                    {page} / {totalPages}
                                </Text>

                                <TouchableOpacity
                                    style={[
                                        styles.pageButton,
                                        page >= totalPages &&
                                        styles.disabledButton,
                                    ]}
                                    disabled={page >= totalPages}
                                    onPress={() =>
                                        handlePageChange(page + 1)
                                    }
                                >
                                    <Text style={styles.pageButtonText}>
                                        Next
                                    </Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={14}
                                        color={
                                            page >= totalPages
                                                ? COLORS.textNeutral
                                                : COLORS.navigationActive
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 17,
        paddingBottom: 36,
    },
    intro: {
        marginBottom: 16,
    },
    title: {
        fontSize: 19,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    subtitle: {
        marginTop: 5,
        fontSize: 11,
        lineHeight: 17,
        color: COLORS.textNeutral,
    },
    centerState: {
        minHeight: 180,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        gap: 12,
    },
    stateText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        textAlign: "center",
    },
    retryText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.navigationActive,
    },
    emptyState: {
        minHeight: 170,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        gap: 9,
    },
    emptyTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    emptyDescription: {
        maxWidth: 260,
        fontSize: 10.5,
        lineHeight: 16,
        color: COLORS.textNeutral,
        textAlign: "center",
    },
    footer: {
        paddingTop: 9,
        gap: 12,
    },
    footerCount: {
        fontSize: 10,
        color: COLORS.textNeutral,
        textAlign: "center",
    },
    pagination: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
    },
    pageButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: COLORS.white,
        paddingHorizontal: 11,
        paddingVertical: 8,
    },
    disabledButton: {
        opacity: 0.45,
    },
    pageButtonText: {
        fontSize: 11,
        fontWeight: "600",
        color: COLORS.navigationActive,
    },
    pageLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
});

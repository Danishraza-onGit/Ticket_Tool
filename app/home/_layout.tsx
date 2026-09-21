import React from "react";
import { View, StyleSheet } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";

import BottomNavBar, {
    BottomNavRoute,
} from "../../components/navigation/BottomNavBar";

export default function HomeLayout() {
    const router = useRouter();
    const pathname = usePathname();

    const getActiveRoute = (): BottomNavRoute => {
        if (pathname.includes("/my-tickets")) {
            return "my-tickets";
        }

        if (pathname.includes("/overdue")) {
            return "overdue";
        }

        if (pathname.includes("/projects")) {
            return "projects";
        }

        return "dashboard";
    };

    const handleNavigate = (route: BottomNavRoute) => {
        switch (route) {
            case "dashboard":
                router.replace("/home");
                break;

            case "my-tickets":
                router.replace("/home/my-tickets");
                break;

            case "overdue":
                router.replace("/home/overdue");
                break;

            case "projects":
                router.replace("/home/projects");
                break;
        }
    };
    const hideBottomNav =
        pathname.includes("/new-ticket") ||
        pathname.includes("/new-project") ||
        pathname.includes("/account") ||
        pathname.includes("/employees");

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Slot />
            </View>

            {!hideBottomNav && (
                <BottomNavBar
                    activeRoute={getActiveRoute()}
                    onNavigate={handleNavigate}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        flex: 1,
    },
});
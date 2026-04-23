import "@/global.css";

import { SyncAuthenticatedUser } from "@/components/sync-authenticated-user";
import { NAV_THEME } from "@/lib/theme";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "@expo-google-fonts/roboto";

import {
    Roboto_100Thin,
    Roboto_200ExtraLight,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_600SemiBold,
    Roboto_700Bold,
    Roboto_800ExtraBold,
    Roboto_900Black
} from "@expo-google-fonts/roboto";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export default function RootLayout() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const hasInitializedTheme = useRef(false);
    const [resolvedColorScheme, setResolvedColorScheme] = useState<
        "light" | "dark"
    >("dark");

    let [loaded] = useFonts({
        Roboto_100Thin,
        Roboto_200ExtraLight,
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_600SemiBold,
        Roboto_700Bold,
        Roboto_800ExtraBold,
        Roboto_900Black
    });

    useEffect(() => {
        if (hasInitializedTheme.current) {
            return;
        }

        setColorScheme("dark");
        hasInitializedTheme.current = true;
    }, [setColorScheme]);

    useEffect(() => {
        if (!colorScheme) {
            return;
        }

        setResolvedColorScheme(colorScheme === "light" ? "light" : "dark");
    }, [colorScheme]);

    if (!loaded) {
        return null;
    }

    return (
        <ClerkProvider tokenCache={tokenCache}>
            <ThemeProvider value={NAV_THEME[resolvedColorScheme]}>
                <StatusBar
                    style={resolvedColorScheme === "dark" ? "light" : "dark"}
                />
                <SyncAuthenticatedUser />
                <Routes />
                <PortalHost />
            </ThemeProvider>
        </ClerkProvider>
    );
}

SplashScreen.preventAutoHideAsync();

function Routes() {
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (isLoaded) {
            SplashScreen.hideAsync();
        }
    }, [isLoaded]);

    if (!isLoaded) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerTransparent: true, headerShown: false }}>
            {/* Screens only shown when the user is NOT signed in */}
            <Stack.Protected guard={!isSignedIn}>
                <Stack.Screen
                    name="(auth)/sign-in"
                    options={SIGN_IN_SCREEN_OPTIONS}
                />
                <Stack.Screen
                    name="(auth)/sign-up"
                    options={SIGN_UP_SCREEN_OPTIONS}
                />
                <Stack.Screen
                    name="(auth)/reset-password"
                    options={DEFAULT_AUTH_SCREEN_OPTIONS}
                />
                <Stack.Screen
                    name="(auth)/forgot-password"
                    options={DEFAULT_AUTH_SCREEN_OPTIONS}
                />
            </Stack.Protected>

            {/* Screens only shown when the user IS signed in */}
            <Stack.Protected guard={isSignedIn}>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: true,
                        headerTitle: ""
                        // header: () => <RootHeader />
                    }}
                />
                <Stack.Screen
                    name="notifications/index"
                    options={NOTIFICATIONS_SCREEN_OPTIONS}
                />
            </Stack.Protected>

            {/* Screens outside the guards are accessible to everyone (e.g. not found) */}
        </Stack>
    );
}

const SIGN_IN_SCREEN_OPTIONS = {
    title: "Sign in"
};

const SIGN_UP_SCREEN_OPTIONS = {
    presentation: "modal",
    title: "",
    gestureEnabled: false
} as const;

const DEFAULT_AUTH_SCREEN_OPTIONS = {
    title: "",
    headerShadowVisible: false
};

const NOTIFICATIONS_SCREEN_OPTIONS = {
    headerShown: true,
    headerTransparent: false,
    headerBackButtonDisplayMode: "minimal",
    title: "Notifications"
} as const;

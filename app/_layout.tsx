import "@/global.css";

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
import * as React from "react";
import { useEffect } from "react";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from "expo-router";

export default function RootLayout() {
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

    if (!loaded) {
        return null;
    }

    return (
        <ClerkProvider tokenCache={tokenCache}>
            <ThemeProvider value={NAV_THEME["dark"]}>
                <StatusBar style={"light"} />
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
        <Stack>
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
                <Stack.Screen name="index" />
            </Stack.Protected>

            {/* Screens outside the guards are accessible to everyone (e.g. not found) */}
        </Stack>
    );
}

const SIGN_IN_SCREEN_OPTIONS = {
    headerShown: false,
    title: "Sign in"
};

const SIGN_UP_SCREEN_OPTIONS = {
    presentation: "modal",
    title: "",
    headerTransparent: true,
    gestureEnabled: false
} as const;

const DEFAULT_AUTH_SCREEN_OPTIONS = {
    title: "",
    headerShadowVisible: false,
    headerTransparent: true
};

import Logo from "@/components/logo";
import { useUser } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

const Layout = () => {
    const { user } = useUser();
    const router = useRouter();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: () => <Logo width={80} height={80} />
                }}
            />
            <Stack.Toolbar placement="right">
                <Stack.Toolbar.Button
                    onPress={() => router.navigate("/notifications")}
                    icon={"bell"}
                />
            </Stack.Toolbar>
            <NativeTabs backBehavior="history" minimizeBehavior="onScrollDown">
                <NativeTabs.Trigger name="index">
                    <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon
                        md="home"
                        sf={{
                            selected: "house.circle.fill",
                            default: "house.circle"
                        }}
                        selectedColor={"#1c76ca"}
                    />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="add">
                    <NativeTabs.Trigger.Icon
                        sf={{
                            selected: "plus.app.fill",
                            default: "plus.app"
                        }}
                        selectedColor={"var(--background)"}
                        md="add_circle"
                    />
                    <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="user-profile">
                    <NativeTabs.Trigger.Badge>9+</NativeTabs.Trigger.Badge>
                    {user?.hasImage ? (
                        <NativeTabs.Trigger.Icon
                            src={{ uri: user.imageUrl, width: 22, height: 22 }}
                            renderingMode="original"
                        />
                    ) : (
                        <NativeTabs.Trigger.Icon
                            sf={{
                                selected: "person.circle.fill",
                                default: "person.circle"
                            }}
                            selectedColor={"#1c76ca"}
                            md="account_circle"
                        />
                    )}

                    <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="search" role="search">
                    <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
                </NativeTabs.Trigger>
            </NativeTabs>
        </>
    );
};

export default Layout;

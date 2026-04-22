import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

const Layout = () => {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    md="home"
                    sf={{
                        selected: "house.circle.fill",
                        default: "house.circle"
                    }}
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="listing">
                <NativeTabs.Trigger.Icon
                    sf={{
                        selected: "plus.app.fill",
                        default: "plus.app"
                    }}
                    md="add_circle"
                />
                <NativeTabs.Trigger.Label>listing</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="user-profile">
                <NativeTabs.Trigger.Icon
                    sf={{
                        selected: "person.circle.fill",
                        default: "person.circle"
                    }}
                    md="account_circle"
                />
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
};

export default Layout;

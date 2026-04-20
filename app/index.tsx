import { InputWithIcon } from "@/components/input-with-icon";
import { UserMenu } from "@/components/user-menu";
import { useSupabase } from "@/hooks/useSupabase";
import { useUser } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

const SCREEN_OPTIONS = {
    headerTransparent: true,
    header: () => (
        <View className="relative">
            <UserMenu />
        </View>
    )
};

export default function Screen() {
    const user = useUser();
    const supabase = useSupabase();

    // window.alert(JSON.stringify(user.user));
    // window.alert(supabase.auth.getUser(user.user.));
    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <View className="h-screen relative flex w-screen px-4 items-center">
                <InputWithIcon
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    autoComplete="email"
                    placeholder="Email"
                    containerClassName="absolute bottom-8"
                    icon={SearchIcon}
                    iconPosition="left"
                />
            </View>
        </>
    );
}

import Logo from "@/components/logo";
import { Icon } from "@/components/ui/icon";
import { UserMenu } from "@/components/user-menu";
import { Link } from "expo-router";
import { BellIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";

const RootHeader = () => {
    return (
        <View className="relative">
            <View className="absolute top-10 w-full px-4 flex flex-row justify-between items-center">
                <Logo />
                <View className="flex flex-row items-center gap-2">
                    <View>
                        <Link asChild href="/notifications">
                            <Icon as={BellIcon} size={30} />
                        </Link>
                    </View>
                    <UserMenu />
                </View>
            </View>
        </View>
    );
};

export default RootHeader;

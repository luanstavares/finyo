import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Icon } from "@/components/ui/icon";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Text } from "@/components/ui/text";
import { useAuth, useUser } from "@clerk/expo";
import type { TriggerRef } from "@rn-primitives/popover";
import { Link } from "expo-router";
import { LogOutIcon, SettingsIcon } from "lucide-react-native";
import * as React from "react";
import { View } from "react-native";
import { Button } from "./ui/button";

export function UserMenu() {
    const { user } = useUser();
    const { signOut } = useAuth();
    const popoverTriggerRef = React.useRef<TriggerRef>(null);

    async function onSignOut() {
        popoverTriggerRef.current?.close();
        await signOut();
    }

    return (
        <Popover>
            <PopoverTrigger asChild ref={popoverTriggerRef}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full">
                    <UserAvatar />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" side="bottom" className="w-80 p-0">
                <View className="gap-3 border-b border-border p-3">
                    <View className="flex-row items-center gap-3">
                        <UserAvatar className="size-10" />
                        <View className="flex-1">
                            <Text className="font-medium leading-5">
                                {user?.fullName ||
                                    user?.emailAddresses[0]?.emailAddress}
                            </Text>
                            {user?.fullName?.length ? (
                                <Text className="text-sm font-normal leading-4 text-muted-foreground">
                                    {user?.username ||
                                        user?.emailAddresses[0]?.emailAddress}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    <View className="flex-row flex-wrap gap-3 py-0.5">
                        <Link asChild href={"/user-profile"}>
                            <Button variant="outline" size="sm">
                                <Icon as={SettingsIcon} className="size-4" />
                                <Text>Manage Account</Text>
                            </Button>
                        </Link>
                    </View>
                </View>
                <Button
                    variant="ghost"
                    size="lg"
                    className="h-16 justify-start gap-3 rounded-none rounded-b-md px-3 sm:h-14"
                    onPress={onSignOut}>
                    <View className="size-10 items-center justify-center">
                        <Icon as={LogOutIcon} className="size-4" />
                    </View>
                    <Text>Sign Out</Text>
                </Button>
            </PopoverContent>
        </Popover>
    );
}

function UserAvatar(props: Omit<React.ComponentProps<typeof Avatar>, "alt">) {
    const { user } = useUser();

    const { initials, imageSource, userName } = React.useMemo(() => {
        const userName =
            user?.fullName ||
            user?.emailAddresses[0]?.emailAddress ||
            "Unknown";
        const initials = userName
            .split(" ")
            .map((name) => name[0])
            .join("");

        const imageSource = user?.imageUrl ? { uri: user.imageUrl } : undefined;
        return { initials, imageSource, userName };
    }, [user?.imageUrl, user?.fullName, user?.emailAddresses[0]?.emailAddress]);

    return (
        <Avatar alt={`${userName}'s avatar`} {...props}>
            <AvatarImage source={imageSource} />
            <AvatarFallback>
                <Text>{initials}</Text>
            </AvatarFallback>
        </Avatar>
    );
}

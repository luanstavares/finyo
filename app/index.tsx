import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { UserMenu } from "@/components/user-menu";
import { Stack } from "expo-router";
import { FileWarningIcon, SearchIcon } from "lucide-react-native";
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
    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <View className="px-4 pt-20">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Text variant={"h2"}>Welcome to Vinted BR</Text>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoComplete="email"
                            placeholder="Email"
                            className="border-primary"
                        />
                        <Button size={"icon"} variant={"default"}>
                            <Icon as={SearchIcon}></Icon>
                        </Button>
                        <Button size={"icon"} variant={"destructive"}>
                            <Icon as={FileWarningIcon}></Icon>
                        </Button>
                    </CardContent>
                    <CardFooter>
                        <Button size={"sm"} variant={"default"}>
                            <Text>Hello Guys</Text>
                        </Button>
                    </CardFooter>
                </Card>
            </View>
        </>
    );
}

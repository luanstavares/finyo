import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@clerk/expo";
import React from "react";
import { View } from "react-native";

const UserProfile = () => {
    const { signOut } = useAuth();

    return (
        <View className="flex-1 items-center justify-center bg-background px-4">
            <Text className="text-foreground">User Profile</Text>
            <Button variant={"secondary"} onPress={() => signOut()}>
                <Text>Sign Out</Text>
            </Button>
            <Button variant={"default"} onPress={() => signOut()}>
                <Text>Sign Out</Text>
            </Button>
        </View>
    );
};

export default UserProfile;

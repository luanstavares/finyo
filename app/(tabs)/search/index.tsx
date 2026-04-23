import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import type { SearchBarCommands } from "react-native-screens";

export default function SearchIndex() {
    const inputRef = useRef<SearchBarCommands | null>(null);
    const router = useRouter();
    const testItems = Array.from({ length: 40 }, (_, index) => ({
        id: `item-${index + 1}`,
        label: `Test item ${index + 1}`
    }));

    useFocusEffect(
        useCallback(() => {
            const timeout = setTimeout(() => {
                inputRef.current?.focus();
            }, 0);

            return () => {
                clearTimeout(timeout);
            };
        }, [])
    );

    return (
        <>
            <Stack.Screen />
            <Stack.SearchBar
                placement="automatic"
                hideWhenScrolling
                onCancelButtonPress={() => router.back()}
                ref={inputRef}
                autoFocus
                placeholder="Search"
                onChangeText={() => {}}
            />
            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-3 pb-10"
                scrollEventThrottle={16}>
                {testItems.map((item) => {
                    return (
                        <View
                            key={item.id}
                            className="h-28 justify-center rounded-xl bg-card px-4">
                            <Text className="text-lg font-medium text-foreground">
                                {item.label}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </>
    );
}

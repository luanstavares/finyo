import * as React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
    const [scrollY, setScrollY] = React.useState(0);
    const testItems = Array.from({ length: 40 }, (_, index) => ({
        id: `item-${index + 1}`,
        label: `Test item ${index + 1}`
    }));
    return (
        <ScrollView
            className="flex-1"
            contentContainerClassName="gap-3 pb-10"
            onScroll={(event) => {
                setScrollY(event.nativeEvent.contentOffset.y);
            }}
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
    );
}

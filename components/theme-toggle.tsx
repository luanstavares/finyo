import { Icon } from "@/components/ui/icon";
import { MoonStarIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Button } from "./ui/button";

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon
};
//Not using
export default function ThemeToggle() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    return (
        <Button onPress={toggleColorScheme} size="icon" variant="default">
            <Icon as={THEME_ICONS[colorScheme ?? "light"]} className="size-6" />
        </Button>
    );
}

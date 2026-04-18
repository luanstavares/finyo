// components/ui/input-with-icon.tsx
import * as React from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";

type InputWithIconProps = React.ComponentProps<typeof Input> & {
    icon: LucideIcon;
    iconPosition?: "left" | "right";
    containerClassName?: string;
};

export function InputWithIcon({
    icon,
    iconPosition = "left",
    className,
    containerClassName,
    onFocus,
    onBlur,
    ...props
}: InputWithIconProps) {
    const [focused, setFocused] = React.useState(false);

    return (
        <View
            className={cn(
                "flex-row items-center rounded-md border border-input bg-background px-3",
                focused && "border-ring",
                containerClassName
            )}>
            {iconPosition === "left" ? (
                <Icon
                    as={icon}
                    size={18}
                    className={cn(
                        "text-muted-foreground",
                        focused && "text-foreground"
                    )}
                />
            ) : null}

            <Input
                className={cn(
                    // remove the inner input chrome, let the wrapper own the border
                    "flex-1 border-0 bg-transparent px-2",
                    className
                )}
                onFocus={(e) => {
                    setFocused(true);
                    onFocus?.(e);
                }}
                onBlur={(e) => {
                    setFocused(false);
                    onBlur?.(e);
                }}
                {...props}
            />

            {iconPosition === "right" ? (
                <Icon
                    as={icon}
                    size={18}
                    className={cn(
                        "text-muted-foreground",
                        focused && "text-foreground"
                    )}
                />
            ) : null}
        </View>
    );
}

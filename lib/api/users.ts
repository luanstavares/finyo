import type { Calendar as ExpoCalendar, Locale as ExpoLocale } from "expo-localization";

import type { User, UserProfile } from "@/lib/generated/prisma/client";

type SyncUserRecord = User & UserProfile;

export type SyncUserLocale = ExpoLocale;
export type SyncUserCalendar = ExpoCalendar;

export type SyncUserRequest = Partial<
    Pick<
        SyncUserRecord,
        "email" | "username" | "displayName" | "avatarUrl" | "countryCode"
    >
> & {
    clerkUserId: SyncUserRecord["clerkUserId"];
    createdAt?: string | null;
    updatedAt?: string | null;
    locale?: SyncUserLocale | null;
    calendar?: SyncUserCalendar | null;
};

export type SyncUserResponse = {
    created: boolean;
    userId: User["id"];
    username: User["username"];
};

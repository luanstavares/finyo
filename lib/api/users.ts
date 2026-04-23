import type { Calendar as ExpoCalendar, Locale as ExpoLocale } from "expo-localization";

import type { User, UserProfile } from "@/lib/generated/prisma/client";

type SyncUserRecord = User & UserProfile;

export enum SyncUserErrorCode {
    AUTH_NOT_CONFIGURED = "AUTH_NOT_CONFIGURED"
}

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

export type SyncUserErrorResponse = {
    error: string;
    code?: SyncUserErrorCode;
};

export function hasSyncUserErrorCode(
    data: unknown,
    code: SyncUserErrorCode
): data is SyncUserErrorResponse {
    if (typeof data !== "object" || data === null || !("code" in data)) {
        return false;
    }

    return data.code === code;
}

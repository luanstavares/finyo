import { useAuth, useUser } from "@clerk/expo";
import { useCalendars, useLocales } from "expo-localization";
import axios from "axios";

import { api } from "@/lib/api/client";
import {
    hasSyncUserErrorCode,
    SyncUserErrorCode,
    type SyncUserRequest,
    type SyncUserResponse
} from "@/lib/api/users";
import { useEffect, useRef } from "react";

function serializeDate(value: Date | number | null | undefined) {
    if (value == null) {
        return null;
    }

    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function SyncAuthenticatedUser() {
    const { getToken, isSignedIn } = useAuth();
    const [calendar] = useCalendars();
    const [locale] = useLocales();
    const { isLoaded, user } = useUser();
    const lastSyncedSignatureRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isSignedIn || !isLoaded || !user?.id) {
            return;
        }

        const currentUser = user;
        const syncSignature = JSON.stringify({
            calendar: calendar?.calendar ?? null,
            clerkUserId: currentUser.id,
            locale: locale?.languageTag ?? null,
            regionCode: locale?.regionCode ?? null,
            timeZone: calendar?.timeZone ?? null,
            updatedAt: serializeDate(currentUser.updatedAt)
        });

        if (lastSyncedSignatureRef.current === syncSignature) {
            return;
        }

        async function syncUser() {
            try {
                const token = await getToken();
                const payload: SyncUserRequest = {
                    clerkUserId: currentUser.id,
                    email:
                        currentUser.primaryEmailAddress?.emailAddress ?? null,
                    username:
                        currentUser.username ??
                        currentUser.primaryEmailAddress?.emailAddress?.split(
                            "@"
                        )[0],
                    displayName: currentUser.fullName ?? null,
                    avatarUrl: currentUser.imageUrl ?? null,
                    countryCode: locale?.regionCode ?? null,
                    createdAt: serializeDate(currentUser.createdAt),
                    updatedAt: serializeDate(currentUser.updatedAt),
                    locale: locale ?? null,
                    calendar: calendar ?? null
                };

                await api.post<SyncUserResponse>("/api/users", payload, {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : undefined
                });

                lastSyncedSignatureRef.current = syncSignature;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (
                        error.response?.status === 503 &&
                        hasSyncUserErrorCode(
                            error.response?.data,
                            SyncUserErrorCode.AUTH_NOT_CONFIGURED
                        )
                    ) {
                        console.warn(
                            "Skipping authenticated user sync. Clerk server auth is not configured for /api/users."
                        );
                        lastSyncedSignatureRef.current = syncSignature;
                        return;
                    }

                    console.error("Failed to sync authenticated user", {
                        baseURL: error.config?.baseURL ?? api.defaults.baseURL,
                        data: error.response?.data,
                        message: error.message,
                        status: error.response?.status,
                        url: error.config?.url
                    });
                    return;
                }

                console.error("Failed to sync authenticated user", error);
            }
        }

        void syncUser();
    }, [calendar, getToken, isLoaded, isSignedIn, locale, user]);

    return null;
}

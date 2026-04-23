import type { SyncUserRequest } from "@/lib/api/users";
import { toValidDate } from "@/lib/date/to-valid-date";
import { Prisma } from "@/lib/generated/prisma/client";
import { UserStatus } from "@/lib/generated/prisma/enums";
import {
    toCalendarIdentifier,
    toWeekday
} from "@/lib/localization/calendar";
import {
    toLocaleMeasurementSystem,
    toLocaleTemperatureUnit,
    toLocaleTextDirection
} from "@/lib/localization/locale";
import { prisma } from "@/lib/prisma";
import { buildUsernameCandidates } from "@/lib/user/username";

type SyncUserPayload = Required<Pick<SyncUserRequest, "clerkUserId">> &
    SyncUserRequest;

export async function upsertSyncUserWithUniqueUsername(
    payload: SyncUserPayload
) {
    const createdAt = toValidDate(payload.createdAt);
    const updatedAt = toValidDate(payload.updatedAt);
    const countryCode =
        payload.locale?.regionCode ?? payload.countryCode ?? null;
    const localeData = payload.locale
        ? {
              languageTag: payload.locale.languageTag,
              languageCode: payload.locale.languageCode,
              languageScriptCode: payload.locale.languageScriptCode,
              regionCode: payload.locale.regionCode,
              languageRegionCode: payload.locale.languageRegionCode,
              currencyCode: payload.locale.currencyCode,
              currencySymbol: payload.locale.currencySymbol,
              languageCurrencyCode: payload.locale.languageCurrencyCode,
              languageCurrencySymbol: payload.locale.languageCurrencySymbol,
              decimalSeparator: payload.locale.decimalSeparator,
              digitGroupingSeparator: payload.locale.digitGroupingSeparator,
              textDirection: toLocaleTextDirection(
                  payload.locale.textDirection
              ),
              measurementSystem: toLocaleMeasurementSystem(
                  payload.locale.measurementSystem
              ),
              temperatureUnit: toLocaleTemperatureUnit(
                  payload.locale.temperatureUnit
              )
          }
        : null;
    const calendarData = payload.calendar
        ? {
              calendar: toCalendarIdentifier(payload.calendar.calendar),
              uses24hourClock: payload.calendar.uses24hourClock,
              firstWeekday: toWeekday(payload.calendar.firstWeekday),
              timeZone: payload.calendar.timeZone
          }
        : null;
    const candidateUsernames = buildUsernameCandidates({
        clerkUserId: payload.clerkUserId,
        username: payload.username
    });

    for (const username of candidateUsernames) {
        try {
            return await prisma.user.upsert({
                where: {
                    clerkUserId: payload.clerkUserId
                },
                update: {
                    email: payload.email ?? null,
                    updatedAt,
                    status: UserStatus.ACTIVE,
                    profile: {
                        upsert: {
                            update: {
                                displayName: payload.displayName ?? null,
                                avatarUrl: payload.avatarUrl ?? null,
                                countryCode,
                                updatedAt
                            },
                            create: {
                                displayName: payload.displayName ?? null,
                                avatarUrl: payload.avatarUrl ?? null,
                                bio: null,
                                countryCode,
                                city: null,
                                createdAt,
                                updatedAt
                            }
                        }
                    },
                    ...(localeData
                        ? {
                              locale: {
                                  upsert: {
                                      update: localeData,
                                      create: localeData
                                  }
                              }
                          }
                        : {}),
                    ...(calendarData
                        ? {
                              calendar: {
                                  upsert: {
                                      update: calendarData,
                                      create: calendarData
                                  }
                              }
                          }
                        : {})
                },
                create: {
                    clerkUserId: payload.clerkUserId,
                    email: payload.email ?? null,
                    username,
                    createdAt,
                    updatedAt,
                    status: UserStatus.ACTIVE,
                    profile: {
                        create: {
                            displayName: payload.displayName ?? null,
                            avatarUrl: payload.avatarUrl ?? null,
                            bio: null,
                            countryCode,
                            city: null,
                            createdAt,
                            updatedAt
                        }
                    },
                    ...(localeData
                        ? {
                              locale: {
                                  create: localeData
                              }
                          }
                        : {}),
                    ...(calendarData
                        ? {
                              calendar: {
                                  create: calendarData
                              }
                          }
                        : {})
                },
                include: {
                    profile: true,
                    locale: true,
                    calendar: true
                }
            });
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002" &&
                Array.isArray(error.meta?.target) &&
                error.meta.target.includes("username")
            ) {
                continue;
            }

            throw error;
        }
    }

    throw new Error("Unable to reserve a unique username for the user");
}

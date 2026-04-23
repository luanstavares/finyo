import type { SyncUserRequest, SyncUserResponse } from "@/lib/api/users";
import { Prisma } from "@/lib/generated/prisma/client";
import { UserStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { utils } from "@/utils/utils";

const upsertWithUniqueUsername = async (
    payload: Required<Pick<SyncUserRequest, "clerkUserId">> & SyncUserRequest
) => {
    const createdAt = utils.format.toDate(payload.createdAt);
    const updatedAt = utils.format.toDate(payload.updatedAt);
    const countryCode =
        payload.locale?.regionCode ?? payload.countryCode ?? null;
    const localeData = payload.locale
        ? utils.user.buildLocaleData(payload.locale)
        : null;
    const calendarData = payload.calendar
        ? utils.user.buildCalendarData(payload.calendar)
        : null;
    const preferredUsername =
        utils.user.normalizeUsername(payload.username) ??
        utils.user.fallbackUsername(payload.clerkUserId);
    const candidateUsernames = Array.from(
        new Set([
            preferredUsername,
            utils.user.fallbackUsername(payload.clerkUserId)
        ])
    );

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
};

export async function POST(request: Request) {
    let payload: SyncUserRequest;

    try {
        payload = (await request.json()) as SyncUserRequest;
    } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!payload.clerkUserId) {
        return Response.json(
            { error: "clerkUserId is required" },
            { status: 400 }
        );
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkUserId: payload.clerkUserId
            },
            select: {
                id: true
            }
        });

        const user = await upsertWithUniqueUsername(
            payload as Required<Pick<SyncUserRequest, "clerkUserId">> &
                SyncUserRequest
        );

        return Response.json(
            {
                created: !existingUser,
                userId: user.id,
                username: user.username
            } satisfies SyncUserResponse,
            { status: existingUser ? 200 : 201 }
        );
    } catch (error) {
        console.error("Failed to sync user", error);
        return Response.json({ error: "Failed to sync user" }, { status: 500 });
    }
}

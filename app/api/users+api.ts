import type { SyncUserRequest, SyncUserResponse } from "@/lib/api/users";
import { prisma } from "@/lib/prisma";
import { utils } from "@/utils/utils";

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

        const user = await utils.user.upsertWithUniqueUsername(
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

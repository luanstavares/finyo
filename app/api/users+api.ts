import type { SyncUserRequest, SyncUserResponse } from "@/lib/api/users";
import { authenticateClerkRequest } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";
import { upsertSyncUserWithUniqueUsername } from "@/lib/user-sync/persistence/upsert-sync-user";

export async function POST(request: Request) {
    let authenticatedUserId: string;
    let payload: SyncUserRequest;

    try {
        const authenticatedRequest = await authenticateClerkRequest(request);

        if (
            !authenticatedRequest.isAuthenticated ||
            !authenticatedRequest.userId
        ) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        authenticatedUserId = authenticatedRequest.userId;
    } catch (error) {
        console.error("Failed to authenticate Clerk request", error);
        return Response.json(
            { error: "Authentication is not configured correctly" },
            { status: 500 }
        );
    }

    try {
        payload = (await request.json()) as SyncUserRequest;
    } catch {
        return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (payload.clerkUserId && payload.clerkUserId !== authenticatedUserId) {
        return Response.json(
            { error: "Authenticated user does not match request body" },
            { status: 403 }
        );
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkUserId: authenticatedUserId
            },
            select: {
                id: true
            }
        });

        const user = await upsertSyncUserWithUniqueUsername({
            ...payload,
            clerkUserId: authenticatedUserId
        } as Required<Pick<SyncUserRequest, "clerkUserId">> & SyncUserRequest);

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

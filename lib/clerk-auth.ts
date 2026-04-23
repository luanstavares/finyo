import { createClerkClient } from "@clerk/backend";

type AuthenticatedClerkRequest = {
    isAuthenticated: boolean;
    userId: string | null;
    reason: string | null;
};

function resolveAuthorizedParties() {
    return process.env.CLERK_AUTHORIZED_PARTIES?.split(",")
        .map((value) => value.trim())
        .filter(Boolean);
}

function resolveClerkPublishableKey() {
    return (
        process.env.CLERK_PUBLISHABLE_KEY ??
        process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
        null
    );
}

function resolveClerkSecretKey() {
    return process.env.CLERK_SECRET_KEY ?? null;
}

export function getClerkRequestAuthenticationConfigurationError() {
    const publishableKey = resolveClerkPublishableKey();
    const secretKey = resolveClerkSecretKey();

    if (publishableKey && secretKey) {
        return null;
    }

    return "Missing Clerk server credentials. Set CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY or EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY.";
}

export async function authenticateClerkRequest(
    request: Request
): Promise<AuthenticatedClerkRequest> {
    const authenticationConfigurationError =
        getClerkRequestAuthenticationConfigurationError();

    if (authenticationConfigurationError) {
        throw new Error(authenticationConfigurationError);
    }

    const publishableKey = resolveClerkPublishableKey() ?? undefined;
    const secretKey = resolveClerkSecretKey() ?? undefined;

    const clerkClient = createClerkClient({
        secretKey,
        publishableKey
    });

    const authorizedParties = resolveAuthorizedParties();
    const requestState = await clerkClient.authenticateRequest(request, {
        ...(process.env.CLERK_JWT_KEY
            ? { jwtKey: process.env.CLERK_JWT_KEY }
            : {}),
        ...(authorizedParties?.length ? { authorizedParties } : {})
    });

    if (!requestState.isAuthenticated) {
        return {
            isAuthenticated: false,
            userId: null,
            reason: requestState.reason
        };
    }

    const { userId } = requestState.toAuth();

    return {
        isAuthenticated: Boolean(userId),
        userId: userId ?? null,
        reason: requestState.reason
    };
}

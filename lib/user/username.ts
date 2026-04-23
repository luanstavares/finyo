type BuildUsernameCandidatesInput = {
    clerkUserId: string;
    username: string | null | undefined;
};

export function normalizeUsername(value: string | null | undefined) {
    if (!value) {
        return null;
    }

    const normalized = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 30);

    return normalized.length > 0 ? normalized : null;
}

export function buildFallbackUsername(clerkUserId: string) {
    const normalized = clerkUserId
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 22);

    return `user_${normalized || "account"}`.slice(0, 30);
}

export function buildUsernameCandidates({
    clerkUserId,
    username
}: BuildUsernameCandidatesInput) {
    const fallbackUsername = buildFallbackUsername(clerkUserId);
    const preferredUsername = normalizeUsername(username) ?? fallbackUsername;

    return Array.from(new Set([preferredUsername, fallbackUsername]));
}

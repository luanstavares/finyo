import { createSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

export function useSupabase() {
    const { getToken } = useAuth();

    return useMemo(() => {
        return createSupabaseClient(async () => {
            return await getToken();
        });
    }, [getToken]);
}

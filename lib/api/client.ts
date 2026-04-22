import axios from "axios";
import Constants from "expo-constants";

function resolveApiBaseUrl() {
    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin;
    }

    const hostUri =
        Constants.expoConfig?.hostUri ?? Constants.platform?.hostUri;

    if (hostUri) {
        return `http://${hostUri.split("/")[0]}`;
    }

    return process.env.EXPO_SERVER_API_BASE_URL ?? "";
}

export const api = axios.create({
    headers: {
        "Content-Type": "application/json"
    },
    baseURL: resolveApiBaseUrl()
});

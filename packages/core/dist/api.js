const BASE_URL = typeof window !== "undefined" ? "" : (process.env.PLATFORM_URL || "https://devtrust.ru");
async function fetchApi(endpoint, options) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}
export async function checkAccess(appId) {
    return fetchApi("/api/internal/check-access", {
        method: "POST",
        body: JSON.stringify({ appId }),
    });
}
export async function checkExternalAccess(appSlug) {
    return fetchApi(`/api/external/${appSlug}/access`);
}
export async function getCurrentUser() {
    return fetchApi("/api/internal/me");
}
export async function getOrganization() {
    return fetchApi("/api/internal/organization");
}
export async function sendUsage(appId, metrics) {
    await fetchApi("/api/internal/usage", {
        method: "POST",
        body: JSON.stringify({ appId, metrics }),
    });
}
export function getAppUrl(appSlug, customDomain) {
    if (customDomain) {
        return `https://${customDomain}`;
    }
    return `https://${appSlug}.devtrust.ru`;
}

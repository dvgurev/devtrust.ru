export interface SSOUser {
    id: string;
    email: string;
    name?: string;
    image?: string;
}
export interface SSOOrganization {
    id: string;
    name: string;
    slug: string;
}
export interface SSOSession {
    user: SSOUser;
    organization: SSOOrganization;
    accessToken: string;
    expiresAt: number;
}
export declare function getCurrentSession(): Promise<SSOSession | null>;
export declare function verifyToken(token: string): Promise<SSOSession | null>;
export declare function refreshToken(refreshToken: string): Promise<SSOSession | null>;
export declare function getSSOLoginUrl(appSlug: string, redirectUrl?: string): string;
export declare function getSSOLogoutUrl(): string;
export declare function getAuthHeaders(): HeadersInit;
//# sourceMappingURL=auth.d.ts.map
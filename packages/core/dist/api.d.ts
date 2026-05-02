import type { User, Organization, AppInfo } from "./types";
export declare function checkAccess(appId: string): Promise<{
    allowed: boolean;
}>;
export declare function checkExternalAccess(appSlug: string): Promise<{
    allowed: boolean;
    app?: AppInfo;
}>;
export declare function getCurrentUser(): Promise<User | null>;
export declare function getOrganization(): Promise<Organization | null>;
export declare function sendUsage(appId: string, metrics: Record<string, number>): Promise<void>;
export declare function getAppUrl(appSlug: string, customDomain?: string): string;
//# sourceMappingURL=api.d.ts.map
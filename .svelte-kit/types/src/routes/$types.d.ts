import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = {  };
type RouteId = '/';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageParentData = EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/" | "/[workspace]" | "/[workspace]/admin" | "/[workspace]/admin/billing/[companyId]" | "/[workspace]/admin/cases" | "/[workspace]/admin/companies" | "/[workspace]/admin/finance" | "/[workspace]/admin/finance/categories" | "/[workspace]/admin/finance/forecast" | "/[workspace]/admin/finance/obligations" | "/[workspace]/admin/finance/recurring" | "/[workspace]/admin/finance/transactions" | "/[workspace]/admin/finance/vendors" | "/[workspace]/admin/profile" | "/[workspace]/admin/projects" | "/[workspace]/admin/projects/[id]" | "/[workspace]/admin/services" | "/[workspace]/admin/settings" | "/[workspace]/admin/support" | "/[workspace]/admin/users" | "/[workspace]/admin/users/[id]" | "/[workspace]/auth/forgot-password" | "/[workspace]/auth/login" | "/[workspace]/auth/reset-password" | "/[workspace]/config" | "/[workspace]/dashboard" | "/[workspace]/dashboard/billing" | "/[workspace]/dashboard/contact" | "/[workspace]/dashboard/profile" | "/[workspace]/dashboard/projects" | "/[workspace]/dashboard/projects/[id]" | "/[workspace]/dashboard/settings" | "/[workspace]/dashboard/support" | "/[workspace]/intake" | "/[workspace]/intake/contact/[caseId]" | "/[workspace]/intake/result/[caseId]" | "/[workspace]/portal" | "/[workspace]/provider" | "/[workspace]/schedule" | "/[workspace]/tickets" | null
type LayoutParams = RouteParams & { workspace?: string; companyId?: string; id?: string; caseId?: string }
type LayoutParentData = EnsureDefined<{}>;

export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type PageProps = { params: RouteParams; data: PageData }
export type LayoutServerData = null;
export type LayoutData = Expand<LayoutParentData>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }
import type * as Kit from '@sveltejs/kit';

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
// @ts-ignore
type MatcherParam<M> = M extends (param : string) => param is infer U ? U extends string ? U : string : string;
type RouteParams = { workspace: string };
type RouteId = '/[workspace]/admin';
type MaybeWithVoid<T> = {} extends T ? T | void : T;
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends { [P in K]: T[K] } ? never : K; }[keyof T];
type OutputDataShape<T> = MaybeWithVoid<Omit<App.PageData, RequiredKeys<T>> & Partial<Pick<App.PageData, keyof T & keyof App.PageData>> & Record<string, any>>
type EnsureDefined<T> = T extends null | undefined ? {} : T;
type OptionalUnion<U extends Record<string, any>, A extends keyof U = U extends U ? keyof U : never> = U extends unknown ? { [P in Exclude<A, keyof U>]?: never } & U : never;
export type Snapshot<T = any> = Kit.Snapshot<T>;
type PageServerParentData = Omit<Omit<EnsureDefined<import('../../$types.js').LayoutServerData>, keyof import('../$types.js').LayoutServerData> & EnsureDefined<import('../$types.js').LayoutServerData>, keyof LayoutServerData> & EnsureDefined<LayoutServerData>;
type PageParentData = Omit<Omit<EnsureDefined<import('../../$types.js').LayoutData>, keyof import('../$types.js').LayoutData> & EnsureDefined<import('../$types.js').LayoutData>, keyof LayoutData> & EnsureDefined<LayoutData>;
type LayoutRouteId = RouteId | "/[workspace]/admin" | "/[workspace]/admin/cases" | "/[workspace]/admin/companies" | "/[workspace]/admin/finance" | "/[workspace]/admin/finance/categories" | "/[workspace]/admin/finance/forecast" | "/[workspace]/admin/finance/obligations" | "/[workspace]/admin/finance/recurring" | "/[workspace]/admin/finance/transactions" | "/[workspace]/admin/finance/vendors" | "/[workspace]/admin/profile" | "/[workspace]/admin/projects" | "/[workspace]/admin/projects/[id]" | "/[workspace]/admin/services" | "/[workspace]/admin/settings" | "/[workspace]/admin/support" | "/[workspace]/admin/users" | "/[workspace]/admin/users/[id]"
type LayoutParams = RouteParams & { workspace?: string; id?: string }
type LayoutServerParentData = Omit<EnsureDefined<import('../../$types.js').LayoutServerData>, keyof import('../$types.js').LayoutServerData> & EnsureDefined<import('../$types.js').LayoutServerData>;
type LayoutParentData = Omit<EnsureDefined<import('../../$types.js').LayoutData>, keyof import('../$types.js').LayoutData> & EnsureDefined<import('../$types.js').LayoutData>;

export type EntryGenerator = () => Promise<Array<RouteParams>> | Array<RouteParams>;
export type PageServerLoad<OutputData extends OutputDataShape<PageServerParentData> = OutputDataShape<PageServerParentData>> = Kit.ServerLoad<RouteParams, PageServerParentData, OutputData, RouteId>;
export type PageServerLoadEvent = Parameters<PageServerLoad>[0];
type ExcludeActionFailure<T> = T extends Kit.ActionFailure<any> ? never : T extends void ? never : T;
type ActionsSuccess<T extends Record<string, (...args: any) => any>> = { [Key in keyof T]: ExcludeActionFailure<Awaited<ReturnType<T[Key]>>>; }[keyof T];
type ExtractActionFailure<T> = T extends Kit.ActionFailure<infer X>	? X extends void ? never : X : never;
type ActionsFailure<T extends Record<string, (...args: any) => any>> = { [Key in keyof T]: Exclude<ExtractActionFailure<Awaited<ReturnType<T[Key]>>>, void>; }[keyof T];
type ActionsExport = typeof import('../../../../../../src/routes/[workspace]/admin/+page.server.js').actions
export type SubmitFunction = Kit.SubmitFunction<Expand<ActionsSuccess<ActionsExport>>, Expand<ActionsFailure<ActionsExport>>>
export type ActionData = Expand<Kit.AwaitedActions<ActionsExport>> | null;
export type PageServerData = null;
export type PageData = Expand<PageParentData>;
export type Action<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Action<RouteParams, OutputData, RouteId>
export type Actions<OutputData extends Record<string, any> | void = Record<string, any> | void> = Kit.Actions<RouteParams, OutputData, RouteId>
export type PageProps = { params: RouteParams; data: PageData; form: ActionData }
export type LayoutServerLoad<OutputData extends OutputDataShape<LayoutServerParentData> = OutputDataShape<LayoutServerParentData>> = Kit.ServerLoad<LayoutParams, LayoutServerParentData, OutputData, LayoutRouteId>;
export type LayoutServerLoadEvent = Parameters<LayoutServerLoad>[0];
export type LayoutServerData = Expand<OptionalUnion<EnsureDefined<Kit.LoadProperties<Awaited<ReturnType<typeof import('./proxy+layout.server.js').load>>>>>>;
export type LayoutData = Expand<Omit<LayoutParentData, keyof LayoutServerData> & EnsureDefined<LayoutServerData>>;
export type LayoutProps = { params: LayoutParams; data: LayoutData; children: import("svelte").Snippet }
export type RequestEvent = Kit.RequestEvent<RouteParams, RouteId>;
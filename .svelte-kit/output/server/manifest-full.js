export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["clients/gg.webp","clients/roan.webp","clients/safari.webp","favicon.svg"]),
	mimeTypes: {".webp":"image/webp",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.B5RJ51tB.js",app:"_app/immutable/entry/app.CwTEhPMv.js",imports:["_app/immutable/entry/start.B5RJ51tB.js","_app/immutable/chunks/CQ-0fdwa.js","_app/immutable/chunks/BcSJwFGV.js","_app/immutable/chunks/5SqYUCyc.js","_app/immutable/chunks/CESy6AzE.js","_app/immutable/chunks/zkGBuNbi.js","_app/immutable/chunks/B0HTGNOF.js","_app/immutable/entry/app.CwTEhPMv.js","_app/immutable/chunks/5SqYUCyc.js","_app/immutable/chunks/CESy6AzE.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/BcSJwFGV.js","_app/immutable/chunks/pEk2KV2V.js","_app/immutable/chunks/Bni1843B.js","_app/immutable/chunks/DGefahfT.js","_app/immutable/chunks/DPrBOiq0.js","_app/immutable/chunks/7hT0NI2S.js","_app/immutable/chunks/Bn-byNMw.js","_app/immutable/chunks/B0HTGNOF.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js')),
			__memo(() => import('./nodes/42.js')),
			__memo(() => import('./nodes/43.js')),
			__memo(() => import('./nodes/44.js')),
			__memo(() => import('./nodes/45.js')),
			__memo(() => import('./nodes/46.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/api/auth/[...path]",
				pattern: /^\/api\/auth(?:\/([^]*))?\/?$/,
				params: [{"name":"path","optional":false,"rest":true,"chained":true}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/_...path_/_server.ts.js'))
			},
			{
				id: "/api/debug-env",
				pattern: /^\/api\/debug-env\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/debug-env/_server.ts.js'))
			},
			{
				id: "/api/public/files",
				pattern: /^\/api\/public\/files\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/public/files/_server.ts.js'))
			},
			{
				id: "/api/users/get-role",
				pattern: /^\/api\/users\/get-role\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/get-role/_server.ts.js'))
			},
			{
				id: "/api/users/sync",
				pattern: /^\/api\/users\/sync\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/sync/_server.ts.js'))
			},
			{
				id: "/[workspace]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin",
				pattern: /^\/([^/]+?)\/admin\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/cases",
				pattern: /^\/([^/]+?)\/admin\/cases\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/companies",
				pattern: /^\/([^/]+?)\/admin\/companies\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance",
				pattern: /^\/([^/]+?)\/admin\/finance\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance/categories",
				pattern: /^\/([^/]+?)\/admin\/finance\/categories\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance/forecast",
				pattern: /^\/([^/]+?)\/admin\/finance\/forecast\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance/obligations",
				pattern: /^\/([^/]+?)\/admin\/finance\/obligations\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance/recurring",
				pattern: /^\/([^/]+?)\/admin\/finance\/recurring\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance/transactions",
				pattern: /^\/([^/]+?)\/admin\/finance\/transactions\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/finance/vendors",
				pattern: /^\/([^/]+?)\/admin\/finance\/vendors\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,4,], errors: [1,,,,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/profile",
				pattern: /^\/([^/]+?)\/admin\/profile\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/projects",
				pattern: /^\/([^/]+?)\/admin\/projects\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/projects/[id]",
				pattern: /^\/([^/]+?)\/admin\/projects\/([^/]+?)\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/services",
				pattern: /^\/([^/]+?)\/admin\/services\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/settings",
				pattern: /^\/([^/]+?)\/admin\/settings\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/support",
				pattern: /^\/([^/]+?)\/admin\/support\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/users",
				pattern: /^\/([^/]+?)\/admin\/users\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/[workspace]/admin/users/[id]",
				pattern: /^\/([^/]+?)\/admin\/users\/([^/]+?)\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/[workspace]/auth/forgot-password",
				pattern: /^\/([^/]+?)\/auth\/forgot-password\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/[workspace]/auth/login",
				pattern: /^\/([^/]+?)\/auth\/login\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/[workspace]/auth/reset-password",
				pattern: /^\/([^/]+?)\/auth\/reset-password\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/[workspace]/config",
				pattern: /^\/([^/]+?)\/config\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard",
				pattern: /^\/([^/]+?)\/dashboard\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/billing",
				pattern: /^\/([^/]+?)\/dashboard\/billing\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/contact",
				pattern: /^\/([^/]+?)\/dashboard\/contact\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/profile",
				pattern: /^\/([^/]+?)\/dashboard\/profile\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/projects",
				pattern: /^\/([^/]+?)\/dashboard\/projects\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/projects/[id]",
				pattern: /^\/([^/]+?)\/dashboard\/projects\/([^/]+?)\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,6,], errors: [1,,,,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/settings",
				pattern: /^\/([^/]+?)\/dashboard\/settings\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/[workspace]/dashboard/support",
				pattern: /^\/([^/]+?)\/dashboard\/support\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,5,], errors: [1,,,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/[workspace]/intake",
				pattern: /^\/([^/]+?)\/intake\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,7,], errors: [1,,,], leaf: 40 },
				endpoint: null
			},
			{
				id: "/[workspace]/intake/contact/[caseId]",
				pattern: /^\/([^/]+?)\/intake\/contact\/([^/]+?)\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false},{"name":"caseId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,7,], errors: [1,,,], leaf: 41 },
				endpoint: null
			},
			{
				id: "/[workspace]/intake/result/[caseId]",
				pattern: /^\/([^/]+?)\/intake\/result\/([^/]+?)\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false},{"name":"caseId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,7,], errors: [1,,,], leaf: 42 },
				endpoint: null
			},
			{
				id: "/[workspace]/portal",
				pattern: /^\/([^/]+?)\/portal\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 43 },
				endpoint: null
			},
			{
				id: "/[workspace]/provider",
				pattern: /^\/([^/]+?)\/provider\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 44 },
				endpoint: null
			},
			{
				id: "/[workspace]/schedule",
				pattern: /^\/([^/]+?)\/schedule\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 45 },
				endpoint: null
			},
			{
				id: "/[workspace]/tickets",
				pattern: /^\/([^/]+?)\/tickets\/?$/,
				params: [{"name":"workspace","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 46 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

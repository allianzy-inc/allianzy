import * as universal_hooks from '../../../src/hooks.ts';

export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43'),
	() => import('./nodes/44'),
	() => import('./nodes/45'),
	() => import('./nodes/46'),
	() => import('./nodes/47')
];

export const server_loads = [0,2,3,5,6];

export const dictionary = {
		"/": [8],
		"/[workspace]": [9,[2]],
		"/[workspace]/admin": [~10,[2,3]],
		"/[workspace]/admin/billing/[companyId]": [~11,[2,3]],
		"/[workspace]/admin/cases": [~12,[2,3]],
		"/[workspace]/admin/companies": [~13,[2,3]],
		"/[workspace]/admin/finance": [14,[2,3,4]],
		"/[workspace]/admin/finance/categories": [15,[2,3,4]],
		"/[workspace]/admin/finance/forecast": [16,[2,3,4]],
		"/[workspace]/admin/finance/obligations": [17,[2,3,4]],
		"/[workspace]/admin/finance/recurring": [18,[2,3,4]],
		"/[workspace]/admin/finance/transactions": [~19,[2,3,4]],
		"/[workspace]/admin/finance/vendors": [20,[2,3,4]],
		"/[workspace]/admin/profile": [21,[2,3]],
		"/[workspace]/admin/projects": [~22,[2,3]],
		"/[workspace]/admin/projects/[id]": [~23,[2,3]],
		"/[workspace]/admin/services": [~24,[2,3]],
		"/[workspace]/admin/settings": [25,[2,3]],
		"/[workspace]/admin/support": [~26,[2,3]],
		"/[workspace]/admin/users": [~27,[2,3]],
		"/[workspace]/admin/users/[id]": [~28,[2,3]],
		"/[workspace]/auth/forgot-password": [~29,[2]],
		"/[workspace]/auth/login": [30,[2]],
		"/[workspace]/auth/reset-password": [31,[2]],
		"/[workspace]/config": [32,[2]],
		"/[workspace]/dashboard": [~33,[2,5]],
		"/[workspace]/dashboard/billing": [~34,[2,5]],
		"/[workspace]/dashboard/contact": [35,[2,5]],
		"/[workspace]/dashboard/profile": [~36,[2,5]],
		"/[workspace]/dashboard/projects": [~37,[2,5]],
		"/[workspace]/dashboard/projects/[id]": [~38,[2,5,6]],
		"/[workspace]/dashboard/settings": [~39,[2,5]],
		"/[workspace]/dashboard/support": [~40,[2,5]],
		"/[workspace]/intake": [~41,[2,7]],
		"/[workspace]/intake/contact/[caseId]": [~42,[2,7]],
		"/[workspace]/intake/result/[caseId]": [~43,[2,7]],
		"/[workspace]/portal": [44,[2]],
		"/[workspace]/provider": [45,[2]],
		"/[workspace]/schedule": [46,[2]],
		"/[workspace]/tickets": [47,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: universal_hooks.reroute || (() => {}),
	transport: universal_hooks.transport || {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';
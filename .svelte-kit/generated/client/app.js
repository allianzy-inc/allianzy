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
	() => import('./nodes/40')
];

export const server_loads = [2,5,6];

export const dictionary = {
		"/": [7],
		"/[workspace]": [8,[2]],
		"/[workspace]/admin": [9,[2,3]],
		"/[workspace]/admin/cases": [10,[2,3]],
		"/[workspace]/admin/finance": [11,[2,3,4]],
		"/[workspace]/admin/finance/categories": [12,[2,3,4]],
		"/[workspace]/admin/finance/forecast": [13,[2,3,4]],
		"/[workspace]/admin/finance/obligations": [14,[2,3,4]],
		"/[workspace]/admin/finance/recurring": [15,[2,3,4]],
		"/[workspace]/admin/finance/transactions": [16,[2,3,4]],
		"/[workspace]/admin/finance/vendors": [17,[2,3,4]],
		"/[workspace]/admin/profile": [18,[2,3]],
		"/[workspace]/admin/projects": [~19,[2,3]],
		"/[workspace]/admin/projects/[id]": [~20,[2,3]],
		"/[workspace]/admin/services": [~21,[2,3]],
		"/[workspace]/admin/settings": [22,[2,3]],
		"/[workspace]/admin/support": [23,[2,3]],
		"/[workspace]/admin/users": [~24,[2,3]],
		"/[workspace]/admin/users/[id]": [~25,[2,3]],
		"/[workspace]/auth/login": [26,[2]],
		"/[workspace]/config": [27,[2]],
		"/[workspace]/dashboard": [~28,[2,5]],
		"/[workspace]/dashboard/billing": [~29,[2,5]],
		"/[workspace]/dashboard/contact": [30,[2,5]],
		"/[workspace]/dashboard/profile": [~31,[2,5]],
		"/[workspace]/dashboard/projects": [~32,[2,5]],
		"/[workspace]/dashboard/projects/[id]": [~33,[2,5,6]],
		"/[workspace]/dashboard/settings": [~34,[2,5]],
		"/[workspace]/dashboard/support": [~35,[2,5]],
		"/[workspace]/intake": [36,[2]],
		"/[workspace]/portal": [37,[2]],
		"/[workspace]/provider": [38,[2]],
		"/[workspace]/schedule": [39,[2]],
		"/[workspace]/tickets": [40,[2]]
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
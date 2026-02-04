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
	() => import('./nodes/32')
];

export const server_loads = [4,5];

export const dictionary = {
		"/": [6],
		"/[workspace]": [7,[2]],
		"/[workspace]/admin": [8,[2,3]],
		"/[workspace]/admin/cases": [9,[2,3]],
		"/[workspace]/admin/profile": [10,[2,3]],
		"/[workspace]/admin/projects": [~11,[2,3]],
		"/[workspace]/admin/projects/[id]": [~12,[2,3]],
		"/[workspace]/admin/services": [~13,[2,3]],
		"/[workspace]/admin/settings": [14,[2,3]],
		"/[workspace]/admin/support": [15,[2,3]],
		"/[workspace]/admin/users": [~16,[2,3]],
		"/[workspace]/admin/users/[id]": [~17,[2,3]],
		"/[workspace]/auth/login": [18,[2]],
		"/[workspace]/config": [19,[2]],
		"/[workspace]/dashboard": [~20,[2,4]],
		"/[workspace]/dashboard/billing": [~21,[2,4]],
		"/[workspace]/dashboard/contact": [22,[2,4]],
		"/[workspace]/dashboard/profile": [~23,[2,4]],
		"/[workspace]/dashboard/projects": [~24,[2,4]],
		"/[workspace]/dashboard/projects/[id]": [~25,[2,4,5]],
		"/[workspace]/dashboard/settings": [~26,[2,4]],
		"/[workspace]/dashboard/support": [~27,[2,4]],
		"/[workspace]/intake": [28,[2]],
		"/[workspace]/portal": [29,[2]],
		"/[workspace]/provider": [30,[2]],
		"/[workspace]/schedule": [31,[2]],
		"/[workspace]/tickets": [32,[2]]
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
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
	() => import('./nodes/27')
];

export const server_loads = [];

export const dictionary = {
		"/": [5],
		"/[workspace]": [6,[2]],
		"/[workspace]/admin": [7,[2,3]],
		"/[workspace]/admin/cases": [8,[2,3]],
		"/[workspace]/admin/profile": [9,[2,3]],
		"/[workspace]/admin/projects": [10,[2,3]],
		"/[workspace]/admin/services": [11,[2,3]],
		"/[workspace]/admin/settings": [12,[2,3]],
		"/[workspace]/admin/support": [13,[2,3]],
		"/[workspace]/admin/users": [14,[2,3]],
		"/[workspace]/auth/login": [15,[2]],
		"/[workspace]/config": [16,[2]],
		"/[workspace]/dashboard": [~17,[2,4]],
		"/[workspace]/dashboard/contact": [18,[2,4]],
		"/[workspace]/dashboard/profile": [19,[2,4]],
		"/[workspace]/dashboard/projects": [~20,[2,4]],
		"/[workspace]/dashboard/settings": [21,[2,4]],
		"/[workspace]/dashboard/support": [22,[2,4]],
		"/[workspace]/intake": [23,[2]],
		"/[workspace]/portal": [24,[2]],
		"/[workspace]/provider": [25,[2]],
		"/[workspace]/schedule": [26,[2]],
		"/[workspace]/tickets": [27,[2]]
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
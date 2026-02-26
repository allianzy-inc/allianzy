import * as server from '../entries/pages/_workspace_/admin/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_workspace_/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[workspace]/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.rmel03q4.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B1Elyt9Z.js","_app/immutable/chunks/KeSxjeKG.js","_app/immutable/chunks/B8ssuaki.js","_app/immutable/chunks/BVm8Pjqf.js","_app/immutable/chunks/5pTnGi91.js","_app/immutable/chunks/Bld1qfbS.js","_app/immutable/chunks/BQ0SU0P_.js","_app/immutable/chunks/jNb5CYfO.js","_app/immutable/chunks/CfoJySEq.js","_app/immutable/chunks/D9LcIM_E.js","_app/immutable/chunks/gXqZbhuu.js","_app/immutable/chunks/Ba3GH2k-.js","_app/immutable/chunks/MApEOntF.js","_app/immutable/chunks/DdeMCk5o.js","_app/immutable/chunks/hmaTgbrz.js","_app/immutable/chunks/DlPS9LCF.js"];
export const stylesheets = [];
export const fonts = [];

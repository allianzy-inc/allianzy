import * as server from '../entries/pages/_workspace_/admin/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_workspace_/admin/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[workspace]/admin/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.C91FbJEi.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/D_P9PPKq.js","_app/immutable/chunks/5SqYUCyc.js","_app/immutable/chunks/BkJB2QUh.js","_app/immutable/chunks/Bmy7hAch.js","_app/immutable/chunks/7hT0NI2S.js","_app/immutable/chunks/Bn-byNMw.js","_app/immutable/chunks/B0HTGNOF.js","_app/immutable/chunks/4vARo2zz.js","_app/immutable/chunks/Dd03yVPH.js","_app/immutable/chunks/CESy6AzE.js","_app/immutable/chunks/Bni1843B.js","_app/immutable/chunks/C5DHN_53.js","_app/immutable/chunks/1qsnfMpV.js","_app/immutable/chunks/BcQrWckh.js","_app/immutable/chunks/DoPCJK1l.js","_app/immutable/chunks/Cu4ipN-V.js"];
export const stylesheets = [];
export const fonts = [];

import * as server from '../entries/pages/_workspace_/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_workspace_/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/[workspace]/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.I-fPX4Qw.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/D_P9PPKq.js","_app/immutable/chunks/5SqYUCyc.js","_app/immutable/chunks/Bmy7hAch.js","_app/immutable/chunks/C5DHN_53.js","_app/immutable/chunks/CESy6AzE.js","_app/immutable/chunks/1qsnfMpV.js","_app/immutable/chunks/BcQrWckh.js","_app/immutable/chunks/Bn-byNMw.js","_app/immutable/chunks/B0HTGNOF.js","_app/immutable/chunks/w36cEt8E.js","_app/immutable/chunks/CQ-0fdwa.js","_app/immutable/chunks/BcSJwFGV.js","_app/immutable/chunks/zkGBuNbi.js"];
export const stylesheets = [];
export const fonts = [];

import * as server from '../entries/pages/_workspace_/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_workspace_/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/[workspace]/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.U4DD1Pqc.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/DQUSOIfx.js","_app/immutable/chunks/CMaAJtTz.js","_app/immutable/chunks/BQ85oUdV.js","_app/immutable/chunks/CloQKHRs.js","_app/immutable/chunks/01ioKMGo.js","_app/immutable/chunks/BzKRwtpO.js","_app/immutable/chunks/DTvMVT3P.js","_app/immutable/chunks/DbzcHl-1.js","_app/immutable/chunks/BW8BoSNC.js","_app/immutable/chunks/CWgEmq4p.js","_app/immutable/chunks/YlfsQA9R.js","_app/immutable/chunks/CJOPJho_.js","_app/immutable/chunks/CU99qYWb.js"];
export const stylesheets = [];
export const fonts = [];

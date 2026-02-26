import * as server from '../entries/pages/_workspace_/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_workspace_/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/[workspace]/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.DK4XPKeC.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/B1Elyt9Z.js","_app/immutable/chunks/KeSxjeKG.js","_app/immutable/chunks/BVm8Pjqf.js","_app/immutable/chunks/Ba3GH2k-.js","_app/immutable/chunks/D9LcIM_E.js","_app/immutable/chunks/MApEOntF.js","_app/immutable/chunks/DdeMCk5o.js","_app/immutable/chunks/Bld1qfbS.js","_app/immutable/chunks/BQ0SU0P_.js","_app/immutable/chunks/B9NlqBBB.js","_app/immutable/chunks/BcHyaY8n.js","_app/immutable/chunks/B4pmGq1J.js"];
export const stylesheets = [];
export const fonts = [];

import * as server from '../entries/pages/_workspace_/dashboard/projects/_id_/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/[workspace]/dashboard/projects/[id]/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.Buomf7z7.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/KeSxjeKG.js","_app/immutable/chunks/gXqZbhuu.js"];
export const stylesheets = [];
export const fonts = [];

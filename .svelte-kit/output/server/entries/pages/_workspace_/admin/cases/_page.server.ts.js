import { d as db, o as intakeCases } from "../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
const load = async ({ params }) => {
  const workspace = params.workspace;
  const cases = await db.select().from(intakeCases).where(eq(intakeCases.workspace, workspace)).orderBy(intakeCases.createdAt);
  return {
    workspace,
    intakeCases: cases
  };
};
export {
  load
};

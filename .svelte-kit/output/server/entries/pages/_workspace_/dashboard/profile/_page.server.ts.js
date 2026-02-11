import { d as db, u as users } from "../../../../../chunks/db.js";
import { eq } from "drizzle-orm";
import { fail, redirect } from "@sveltejs/kit";
import { u as uploadFile, a as getSignedUrlForFile } from "../../../../../chunks/storage.js";
const load = async ({ locals, params }) => {
  if (!locals.user) {
    throw redirect(303, `/${params.workspace}/auth/login`);
  }
  const userData = await db.query.users.findFirst({
    where: eq(users.id, parseInt(locals.user.id))
  });
  if (!userData) {
    throw redirect(303, `/${params.workspace}/auth/login`);
  }
  if (userData.avatarUrl) {
    userData.avatarUrl = await getSignedUrlForFile(userData.avatarUrl, params.workspace);
  }
  return {
    profile: userData
  };
};
const actions = {
  updateProfile: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { message: "Unauthorized" });
    const formData = await request.formData();
    const updateData = {};
    const textFields = ["firstName", "lastName", "phone", "jobTitle", "company"];
    for (const field of textFields) {
      if (formData.has(field)) {
        updateData[field] = formData.get(field);
      }
    }
    const identificationJson = formData.get("identification");
    if (formData.has("identification") && identificationJson) {
      try {
        updateData.identification = JSON.parse(identificationJson);
      } catch (e) {
        console.error("Error parsing identification JSON", e);
      }
    }
    const linksJson = formData.get("links");
    if (formData.has("links") && linksJson) {
      try {
        updateData.companyLinks = JSON.parse(linksJson);
      } catch (e) {
        console.error("Error parsing links JSON", e);
      }
    }
    const addressesJson = formData.get("addresses");
    if (formData.has("addresses") && addressesJson) {
      try {
        updateData.addresses = JSON.parse(addressesJson);
      } catch (e) {
        console.error("Error parsing addresses JSON", e);
      }
    }
    const deleteAvatar = formData.get("deleteAvatar");
    if (deleteAvatar === "true") {
      updateData.avatarUrl = null;
    }
    const avatar = formData.get("avatar");
    if (avatar && avatar.size > 0 && avatar.name && avatar.name !== "undefined") {
      try {
        const url = await uploadFile(avatar, "avatars");
        updateData.avatarUrl = url;
      } catch (err) {
        console.error("Error uploading avatar:", err);
        return fail(500, { message: "Error uploading avatar" });
      }
    }
    const logo = formData.get("logo");
    if (logo && logo.size > 0 && logo.name && logo.name !== "undefined") {
      try {
        const url = await uploadFile(logo, "logos");
        updateData.companyLogo = url;
      } catch (err) {
        console.error("Error uploading logo:", err);
        return fail(500, { message: "Error uploading logo" });
      }
    }
    if (Object.keys(updateData).length === 0) {
      return { success: true, message: "No se detectaron cambios" };
    }
    try {
      await db.update(users).set(updateData).where(eq(users.id, parseInt(locals.user.id)));
      return { success: true, message: "Guardado correctamente" };
    } catch (err) {
      console.error("Error updating profile:", err);
      return fail(500, { message: "Error updating profile" });
    }
  }
};
export {
  actions,
  load
};

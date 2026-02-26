import { o as intakeCases, d as db } from "../../../../chunks/db.js";
import { eq, and } from "drizzle-orm";
import { fail, error, redirect } from "@sveltejs/kit";
import { randomUUID } from "crypto";
import { b as private_env } from "../../../../chunks/shared-server.js";
const load = async ({ params, url }) => {
  const workspace = params.workspace;
  const caseIdParam = url.searchParams.get("caseId");
  const editPre = url.searchParams.get("edit") === "pre";
  if (!caseIdParam) {
    return {
      workspace,
      step: 1,
      existingCase: null,
      caseId: null,
      prefillPre: null,
      prefillGuided: null
    };
  }
  const caseId = Number(caseIdParam);
  if (Number.isNaN(caseId)) {
    throw error(400, "Invalid case id");
  }
  const intakeCase = await db.query.intakeCases.findFirst({
    where: and(eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace))
  });
  if (!intakeCase) {
    throw error(404, "Case not found");
  }
  const answers = intakeCase.answersJson ?? {};
  const prefillPre = answers.preEvaluation ?? null;
  const prefillGuided = answers.guidedEvaluation ?? null;
  if (editPre) {
    return {
      workspace,
      step: 1,
      existingCase: intakeCase,
      caseId: intakeCase.id,
      prefillPre,
      prefillGuided: null
    };
  }
  return {
    workspace,
    step: 2,
    existingCase: intakeCase,
    caseId: intakeCase.id,
    prefillPre: null,
    prefillGuided
  };
};
function computeScore(input) {
  let score = 0;
  if (input.helpType === "sistemas_plataforma" || input.helpType === "automatizacion_integraciones" || input.helpType === "escalabilidad_control") {
    score += 3;
  } else if (input.helpType === "diagnostico_estrategico") {
    score += 2;
  }
  switch (input.impact) {
    case "crecimiento_bloqueado":
      score += 3;
      break;
    case "riesgo":
      score += 2;
      break;
    case "falta_control":
      score += 2;
      break;
    case "costos":
    case "perdida_tiempo":
      score += 1;
      break;
  }
  switch (input.people) {
    case "50_plus":
      score += 3;
      break;
    case "10_50":
      score += 2;
      break;
    case "4_10":
      score += 1;
      break;
    case "1_3":
      score += 0;
      break;
  }
  switch (input.urgency) {
    case "inmediato":
      score += 2;
      break;
    case "proximos_3_meses":
      score += 1;
      break;
    case "exploratorio":
      score += 0;
      break;
  }
  switch (input.priorAttempt) {
    case "consultoria_previa":
    case "desarrollo_a_medida":
      score += 2;
      break;
    case "software_externo":
    case "ajustes_internos":
      score += 1;
      break;
    case "nada":
      score += 0;
      break;
  }
  switch (input.currentStack) {
    case "sistema_propio":
    case "software_generico":
      score += 2;
      break;
    case "sheets_excel":
    case "whatsapp_email":
      score += 1;
      break;
    case "sin_proceso_formal":
      score += 0;
      break;
  }
  switch (input.finalDecisor) {
    case "yo":
    case "direccion_gerencia":
    case "direccion":
    case "socios":
      score += 2;
      break;
    case "comite_compras_legal":
    case "otro":
      score += 1;
      break;
  }
  return score;
}
function computeStatus(score, helpType) {
  if (helpType === "marketing_diseno_web") {
    return "redirect_beltrix";
  }
  if (score >= 7) return "qualifies_allianzy";
  if (score >= 4) return "needs_review";
  return "closed_no_fit";
}
const actions = {
  start: async ({ request, params, cookies }) => {
    const workspace = params.workspace;
    const formData = await request.formData();
    const helpType = formData.get("help_type");
    const impact = formData.get("impact");
    const people = formData.get("people");
    const urgency = formData.get("urgency");
    if (!helpType || !impact || !people || !urgency) {
      return fail(400, {
        error: "Completa todas las preguntas para continuar.",
        values: Object.fromEntries(formData)
      });
    }
    if (helpType === "marketing_diseno_web") {
      const anonymousToken2 = cookies.get("intake_token") ?? randomUUID();
      const [created2] = await db.insert(intakeCases).values({
        workspace,
        status: "redirect_beltrix",
        score: null,
        anonymousToken: anonymousToken2,
        answersJson: {
          preEvaluation: {
            helpType,
            impact,
            people,
            urgency
          }
        }
      }).returning();
      cookies.set("intake_token", anonymousToken2, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7
      });
      const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(",")[0].trim();
      const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
      const isProduction = process.env.NODE_ENV === "production";
      const beltrixBase = (private_env.BELTRIX_AGENCY_URL ?? "").replace(/\/$/, "");
      const useExternalBeltrix = Boolean(beltrixBase || workspace === "allianzy" && (isProduction || !isLocalhost));
      const baseUrl = beltrixBase || (useExternalBeltrix ? "https://beltrix.agency" : "");
      const url = baseUrl ? `${baseUrl}?from=${workspace}` : `/beltrix/intake?from=${workspace}`;
      throw redirect(303, url);
    }
    const anonymousToken = cookies.get("intake_token") ?? randomUUID();
    const [created] = await db.insert(intakeCases).values({
      workspace,
      status: "draft",
      score: null,
      anonymousToken,
      answersJson: {
        preEvaluation: {
          helpType,
          impact,
          people,
          urgency
        }
      }
    }).returning();
    cookies.set("intake_token", anonymousToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7
    });
    throw redirect(303, `/${workspace}/intake?caseId=${created.id}`);
  },
  updatePre: async ({ request, params, cookies, locals }) => {
    const workspace = params.workspace;
    const formData = await request.formData();
    const caseIdRaw = formData.get("case_id");
    const caseId = Number(caseIdRaw);
    if (!caseIdRaw || Number.isNaN(caseId)) {
      return fail(400, { error: "Caso inválido." });
    }
    const helpType = formData.get("help_type");
    const impact = formData.get("impact");
    const people = formData.get("people");
    const urgency = formData.get("urgency");
    if (!helpType || !impact || !people || !urgency) {
      return fail(400, {
        error: "Completa todas las preguntas para continuar.",
        values: Object.fromEntries(formData)
      });
    }
    const conditions = [eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)];
    if (!locals.user) {
      const anonymousToken = cookies.get("intake_token");
      if (!anonymousToken) {
        throw error(403, "Not allowed");
      }
      conditions.push(eq(intakeCases.anonymousToken, anonymousToken));
    }
    const existing = await db.query.intakeCases.findFirst({
      where: and(...conditions)
    });
    if (!existing) {
      throw error(404, "Case not found");
    }
    if (helpType === "marketing_diseno_web") {
      await db.update(intakeCases).set({
        answersJson: {
          ...existing.answersJson ?? {},
          preEvaluation: { helpType, impact, people, urgency }
        },
        status: "redirect_beltrix",
        score: null,
        updatedAt: /* @__PURE__ */ new Date()
      }).where(and(eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)));
      const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "").split(",")[0].trim();
      const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
      const isProduction = process.env.NODE_ENV === "production";
      const beltrixBase = (private_env.BELTRIX_AGENCY_URL ?? "").replace(/\/$/, "");
      const useExternalBeltrix = Boolean(beltrixBase || workspace === "allianzy" && (isProduction || !isLocalhost));
      const baseUrl = beltrixBase || (useExternalBeltrix ? "https://beltrix.agency" : "");
      const url = baseUrl ? `${baseUrl}?from=${workspace}` : `/beltrix/intake?from=${workspace}`;
      throw redirect(303, url);
    }
    const answers = existing.answersJson ?? {};
    const updatedAnswers = {
      ...answers,
      preEvaluation: { helpType, impact, people, urgency }
    };
    await db.update(intakeCases).set({
      answersJson: updatedAnswers,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(and(eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)));
    throw redirect(303, `/${workspace}/intake?caseId=${caseId}`);
  },
  complete: async ({ request, params, cookies, locals, url }) => {
    const workspace = params.workspace;
    const formData = await request.formData();
    const caseIdRaw = formData.get("case_id");
    const caseId = Number(caseIdRaw);
    if (!caseIdRaw || Number.isNaN(caseId)) {
      return fail(400, { error: "Caso inválido." });
    }
    const context = String(formData.get("context") || "").slice(0, 2e3);
    const problem = String(formData.get("problem") || "").slice(0, 2e3);
    const attempts = formData.get("prior_attempt");
    const stack = formData.get("current_stack");
    const expected = String(formData.get("expected_result") || "").slice(0, 2e3);
    const decisor = formData.get("final_decisor");
    const problemArea = formData.get("problem_area");
    const validDecisors = ["yo", "direccion_gerencia", "socios", "comite_compras_legal"];
    const validAreas = [
      "operacion_backoffice",
      "ventas_comercial",
      "produccion_taller",
      "logistica",
      "finanzas_pagos",
      "soporte_atencion",
      "ti_sistemas"
    ];
    if (!attempts || !stack || !decisor || !validDecisors.includes(decisor)) {
      return fail(400, {
        error: "Completa todos los campos obligatorios.",
        values: Object.fromEntries(formData)
      });
    }
    if (!problemArea || !validAreas.includes(problemArea)) {
      return fail(400, {
        error: "Seleccioná el área donde ocurre principalmente el problema.",
        values: Object.fromEntries(formData)
      });
    }
    const anonymousToken = cookies.get("intake_token");
    const conditions = [eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)];
    if (!locals.user) {
      if (!anonymousToken) {
        throw error(403, "Not allowed");
      }
      conditions.push(eq(intakeCases.anonymousToken, anonymousToken));
    }
    const existing = await db.query.intakeCases.findFirst({
      where: and(...conditions)
    });
    if (!existing) {
      throw error(404, "Case not found");
    }
    const answers = existing.answersJson ?? {};
    const pre = answers.preEvaluation ?? {};
    const helpType = pre.helpType;
    const impact = pre.impact;
    const people = pre.people ?? pre.personas;
    const urgency = pre.urgency;
    if (!helpType || !impact || !people || !urgency) {
      throw error(400, "Pre-evaluation incomplete.");
    }
    const score = computeScore({
      helpType,
      impact,
      people,
      urgency,
      priorAttempt: attempts,
      currentStack: stack,
      finalDecisor: decisor
    });
    const status = computeStatus(score, helpType);
    const updatedAnswers = {
      ...answers,
      preEvaluation: pre,
      guidedEvaluation: {
        context,
        problem,
        problemArea,
        priorAttempt: attempts,
        currentStack: stack,
        expectedResult: expected,
        finalDecisor: decisor
      }
    };
    await db.update(intakeCases).set({
      answersJson: updatedAnswers,
      score,
      status,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(and(eq(intakeCases.id, caseId), eq(intakeCases.workspace, workspace)));
    throw redirect(303, `/${workspace}/intake/result/${caseId}`);
  }
};
export {
  actions,
  load
};

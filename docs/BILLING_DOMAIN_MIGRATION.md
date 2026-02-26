# Billing Domain – Plan de migración y arquitectura

## Objetivo

Rediseñar el módulo de Facturación para que sea **provider-agnostic** (Stripe, MercadoPago, PayPal, transferencias, manual) y consistente con un sistema de billing robusto.

- **Fuente de verdad**: nuestra DB. Todo lo que se muestra en `/dashboard/billing` y `/admin/billing` sale de la DB.
- **Stripe** (y futuros providers) solo alimentan/sincronizan datos (read model + webhooks).
- Soporta: múltiples cuentas por empresa, pagos manuales, conciliación, pagos parciales y auditoría.

---

## 1. Modelo de dominio (nuevas tablas)

### A) `payment_accounts`

Una empresa puede tener varias cuentas (varios customers Stripe históricos, MP, PayPal, etc.).

| Campo         | Tipo     | Descripción                                      |
|---------------|----------|--------------------------------------------------|
| id            | uuid PK  |                                                  |
| company_id    | FK       | companies.id                                     |
| provider      | enum     | stripe, mercadopago, paypal, bank, manual        |
| label         | text     | ej. "Stripe principal", "MP AR"                  |
| external_id   | text     | cus_xxx, email PayPal, alias MP                  |
| status        | enum     | active, archived                                 |
| is_default    | boolean  |                                                  |
| metadata      | jsonb    |                                                  |
| created_at    | timestamptz |                                              |
| updated_at    | timestamptz |                                              |

**Regla**: nunca asumir 1 cuenta = 1 empresa.

### B) `billing_documents`

Documentos de cobro genéricos (invoice, receipt, credit_note).

| Campo               | Tipo     | Descripción                          |
|---------------------|----------|--------------------------------------|
| id                  | uuid PK  |                                      |
| company_id          | FK       |                                      |
| type                | enum     | invoice, receipt, credit_note        |
| provider            | enum     | mismo que payment_accounts           |
| provider_document_id| text     | ej. Stripe invoice id                |
| payment_account_id  | FK       | nullable                             |
| number              | text     | ej. "ZVLFJ3VR-0001"                  |
| currency            | text     |                                      |
| amount_total        | integer  | minor units (centavos)               |
| amount_due          | integer  | minor units                           |
| status              | enum     | draft, open, paid, void, uncollectible, canceled |
| due_date            | timestamptz | nullable                          |
| issued_at           | timestamptz | nullable                          |
| description         | text     | nullable                             |
| source              | enum     | project, subscription, manual, import |
| project_id          | FK       | nullable                             |
| subscription_record_id | FK    | nullable (si aplica)                  |
| metadata            | jsonb    | line items, links, pdf url, etc.     |
| created_at, updated_at | timestamptz |                              |

**Reglas**: montos siempre en minor units; status mapeable por provider; metadata para detalles extra.

### C) `billing_line_items`

Detalle opcional por documento (itemización interna + la que venga del provider).

| Campo               | Tipo     |
|---------------------|----------|
| id                  | uuid PK  |
| billing_document_id | FK       |
| name                | text     |
| description         | text     |
| quantity            | numeric  |
| unit_amount         | integer  | minor |
| amount              | integer  | minor |
| metadata            | jsonb    |
| created_at          | timestamptz |

### D) `payment_transactions`

Pagos y transferencias. Un documento puede tener N transacciones (pagos parciales).

| Campo               | Tipo     |
|---------------------|----------|
| id                  | uuid PK  |
| company_id          | FK       |
| billing_document_id | FK nullable (conciliación posterior) |
| provider            | enum     |
| payment_account_id  | FK nullable |
| provider_payment_id | text nullable |
| amount              | integer  | minor |
| currency            | text     |
| status              | enum     | pending, succeeded, failed, refunded, canceled |
| paid_at             | timestamptz nullable |
| raw                 | jsonb    |
| created_at          | timestamptz |

### E) `subscription_records`

Suscripciones de cualquier provider.

| Campo                   | Tipo     |
|-------------------------|----------|
| id                      | uuid PK  |
| company_id              | FK       |
| provider                | enum     |
| provider_subscription_id| text nullable |
| payment_account_id      | FK nullable |
| status                  | enum     | active, trialing, past_due, canceled, incomplete |
| current_period_start    | timestamptz |
| current_period_end      | timestamptz |
| amount                  | integer  | minor |
| currency                | text     |
| metadata                | jsonb    |
| created_at, updated_at  | timestamptz |

---

## 2. Flujo de datos

- **UI** → consulta solo APIs internas que leen **nuestra DB**.
- **Stripe** (y otros):
  - **Sync on-demand**: al entrar a Billing (con cache/rate-limit).
  - **Cron/background** (si existe).
  - **Webhooks** (recomendado): `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated/deleted`, `invoice.finalized` → persistir en DB.
- Servicio **BillingSyncService** por provider (StripeBillingSyncService; luego MercadoPagoSyncService, etc.).

---

## 3. Stripe: solo lectura, seguro

- `STRIPE_SECRET_KEY` solo en servidor.
- Sync: por cada `payment_account` tipo stripe de la empresa, traer invoices/subscriptions y hacer upsert en DB (idempotente por `provider_document_id`).
- Webhooks: endpoint `/api/webhooks/stripe`, verificar firma (`STRIPE_WEBHOOK_SECRET`), persistir eventos en DB.

---

## 4. Matching / múltiples cuentas

- No usar email como clave.
- `payment_accounts` asocia varios `external_id` (ej. varios cus_xxx) a la misma empresa.
- Admin: “Vincular cuenta de pago” → crea `payment_account` (active), opcional default → luego disparar sync.

---

## 5. Project → Payments → Billing

- Al crear/marcar pago en proyecto:
  - Crear/actualizar `billing_document` con `source = 'project'`.
  - Si el pago se marca “paid”: crear `payment_transaction` (succeeded), actualizar `amount_due` y `status` del documento.
- No acoplar a Stripe; si luego se crea invoice en Stripe, se puede linkear.

---

## 6. Estrategia de migración (no romper lo actual)

1. **Fase 1**: Crear nuevas tablas y enums (sin tocar companies/payments aún).  
   - Ejecutar: `node scripts/run-migration-0010.js`
2. **Fase 2**: Backfill
   - Migrar `companies.stripe_accounts` / `stripe_customer_id` → `payment_accounts` (provider=stripe).  
   - Script: `scripts/backfill-payment-accounts-from-stripe.js` (por crear).
   - Mapear pagos existentes de proyectos → `billing_documents` (source=project) + `payment_transactions`.
3. **Fase 3**: UI actual sigue funcionando; adaptar lecturas para usar `billing_documents` + `payment_accounts` cuando existan datos.
4. **Fase 4**: Stripe sync (ya implementado `stripe-sync.service.ts`): upsert invoices/subscriptions en `billing_documents` / `subscription_records`.
5. **Fase 5**: Activar webhooks Stripe (opcional): endpoint `/api/webhooks/stripe`.
6. **Fase 6**: Deprecar uso directo de `companies.stripe_customer_id` / `stripe_accounts` en favor de `payment_accounts`.

---

## 7. Orden de implementación

| Orden | Entregable |
|-------|------------|
| A     | DB schema + migrations (enums, tablas) |
| B     | Repositorios/DAO + tipos TS |
| C     | Billing domain services (create doc, record payment, reconciliation) |
| D     | Stripe sync service (invoices + subscriptions) |
| E     | Endpoints API para dashboard y admin |
| F     | Refactor UI `/dashboard/billing` y `/admin/billing/:companyId` |
| G     | Tests básicos (upsert, multi-account, partial payments) |

---

## 8. Calidad

- Montos siempre en **minor units**.
- **Idempotencia** en webhooks y sync (upsert por `provider_document_id` / `provider_payment_id`).
- No exponer Stripe secret en client.
- Paginación y rate limits (backoff simple) en sync.
- Logging claro en sync y webhooks.

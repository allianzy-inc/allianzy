import { pgTable, serial, text, timestamp, boolean, integer, jsonb, primaryKey, decimal, char, index, uuid, pgEnum, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- Billing Domain Enums (provider-agnostic) ---
export const billingProviderEnum = pgEnum('billing_provider', ['stripe', 'mercadopago', 'paypal', 'payoneer', 'bank', 'manual']);
export const paymentAccountStatusEnum = pgEnum('payment_account_status', ['active', 'archived']);
export const billingDocumentTypeEnum = pgEnum('billing_document_type', ['invoice', 'receipt', 'credit_note']);
export const billingDocumentStatusEnum = pgEnum('billing_document_status', ['draft', 'open', 'paid', 'void', 'uncollectible', 'canceled']);
export const billingDocumentSourceEnum = pgEnum('billing_document_source', ['project', 'subscription', 'manual', 'import']);
export const paymentTransactionStatusEnum = pgEnum('payment_transaction_status', ['pending', 'succeeded', 'failed', 'refunded', 'canceled']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'trialing', 'past_due', 'canceled', 'incomplete']);

export const workspaces = pgTable('workspaces', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
});



export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    role: text('role').default('staff'), // staff, client, provider
    avatarUrl: text('avatar_url'),
    phone: text('phone'),
    addresses: jsonb('addresses'), // Array of { label, address, city, country, state, postalCode }
    company: text('company'),
    companyLogo: text('company_logo'),
    companyLinks: jsonb('company_links'), // Array of { title, url }
    jobTitle: text('job_title'),
    identification: jsonb('identification'), // Array of { type: string, value: string }
    notes: text('notes'),
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').default('Active'), // Active, Pending Payment, Inactive
    price: text('price'),
    renewalDate: text('renewal_date'),
    clientId: integer('client_id').references(() => users.id), // References local User ID
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const subservices = pgTable('subservices', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').default('Active'),
    price: text('price'),
    serviceId: integer('service_id').references(() => services.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').default('Pending'),
    provider: text('provider').default('Allianzy'), // Allianzy, Beltrix, Provider
    clientId: integer('client_id').references(() => users.id),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'set null' }), // empresa a la que pertenece el proyecto (evita mezclar si el cliente tiene varias)
    serviceId: integer('service_id').references(() => services.id),
    links: jsonb('links'), // Array of { title, url }
    imageUrl: text('image_url'),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const cases = pgTable('cases', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('open'), // open, in_progress, closed
    priority: text('priority').default('medium'), // low, medium, high
    clientId: integer('client_id').references(() => users.id), // Creator
    projectId: integer('project_id').references(() => projects.id),
    assignedTo: integer('assigned_to').references(() => users.id), // Admin/Staff
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    closedAt: timestamp('closed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Intake / Pre-evaluation funnel
export const intakeCases = pgTable('intake_cases', {
    id: serial('id').primaryKey(),
    // Workspace slug: e.g. 'allianzy', 'beltrix'
    workspace: text('workspace').notNull(),
    status: text('status').notNull().default('draft'), // draft, qualifies_allianzy, needs_review, closed_no_fit, redirect_beltrix, pending_contact
    score: integer('score'),
    answersJson: jsonb('answers_json').$type<Record<string, any> | null>().default(null),
    anonymousToken: text('anonymous_token').notNull(),
    userId: integer('user_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    workspaceIdx: index('intake_cases_workspace_idx').on(t.workspace),
    statusIdx: index('intake_cases_status_idx').on(t.status),
    tokenIdx: index('intake_cases_token_idx').on(t.anonymousToken),
}));

export const intakeCaseContacts = pgTable('intake_case_contacts', {
    id: serial('id').primaryKey(),
    caseId: integer('case_id').references(() => intakeCases.id, { onDelete: 'cascade' }),
    fullName: text('full_name').notNull(),
    email: text('email').notNull(),
    company: text('company').notNull(),
    roleTitle: text('role_title'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    caseIdIdx: index('intake_case_contacts_case_id_idx').on(t.caseId),
    emailIdx: index('intake_case_contacts_email_idx').on(t.email),
}));

export const caseComments = pgTable('case_comments', {
    id: serial('id').primaryKey(),
    caseId: integer('case_id').references(() => cases.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    authorName: text('author_name'),
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    caseIdIdx: index('case_comments_case_id_idx').on(t.caseId),
}));

export const requestComments = pgTable('request_comments', {
    id: serial('id').primaryKey(),
    requestId: integer('request_id').references(() => requests.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    authorName: text('author_name'),
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    requestIdIdx: index('request_comments_request_id_idx').on(t.requestId),
}));

export const projectMilestones = pgTable('project_milestones', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    order: integer('order').notNull(),
    status: text('status').default('pending'),
    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const proposals = pgTable('project_proposals', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending'), // pending, approved, rejected
    documentUrl: text('document_url'),
    files: jsonb('files'), // Array of { name, url, type }
    projectId: integer('project_id').references(() => projects.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const proposalComments = pgTable('proposal_comments', {
    id: serial('id').primaryKey(),
    proposalId: integer('proposal_id').references(() => proposals.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    authorName: text('author_name'),
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    proposalIdIdx: index('proposal_comments_proposal_id_idx').on(t.proposalId),
}));

export const payments = pgTable('payments', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(), // e.g., "Initial Deposit", "Milestone 2"
    amount: text('amount').notNull(),
    status: text('status').default('pending'), // pending, paid, overdue
    documentUrl: text('document_url'),
    dueDate: timestamp('due_date'),
    paidAt: timestamp('paid_at'),
    projectId: integer('project_id').references(() => projects.id), // Keeping for backward compatibility/migration, but moving to join table
    
    // New fields requested
    amountOriginal: decimal('amount_original', { precision: 14, scale: 2 }),
    currencyOriginal: char('currency_original', { length: 3 }),
    amountPaid: decimal('amount_paid', { precision: 14, scale: 2 }),
    currencyPaid: char('currency_paid', { length: 3 }),
    exchangeRate: decimal('exchange_rate', { precision: 14, scale: 6 }), // calculado: original/abonado cuando convenga
    amountUsd: decimal('amount_usd', { precision: 14, scale: 2 }),
    paymentMethod: text('payment_method'),
    providerPaymentId: text('provider_payment_id'),

    createdAt: timestamp('created_at').defaultNow(),
});

export const requests = pgTable('requests', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id),
    clientId: integer('client_id').references(() => users.id),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending'),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const requirements = pgTable('requirements', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending'),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const requirementComments = pgTable('requirement_comments', {
    id: serial('id').primaryKey(),
    requirementId: integer('requirement_id').references(() => requirements.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    authorName: text('author_name'),
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    requirementIdIdx: index('requirement_comments_requirement_id_idx').on(t.requirementId),
}));

export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    logo: text('logo'),
    phone: text('phone'),
    email: text('email'),
    website: text('website'),
    region: text('region'),
    timezone: text('timezone'),
    address: jsonb('address'), // { street, city, state, postalCode, country, officeName }
    addresses: jsonb('addresses'), // Array of { label, address, city, country, state, postalCode }
    links: jsonb('links'), // Array of { title, url }
    documents: jsonb('documents'), // Array of { type: string, value: string }
    registrationDetails: jsonb('registration_details'), // { acn, abn, ndisRegistration }
    memberLimit: integer('member_limit'), // max members (owner + admins + members); null = unlimited
    stripeCustomerId: text('stripe_customer_id'), // legacy single; use stripe_accounts when present
    /** Múltiples cuentas Stripe: [{ customerId: 'cus_xxx', isDefault: true }, ...] */
    stripeAccounts: jsonb('stripe_accounts'), // default []
    stripeSubscriptionId: text('stripe_subscription_id'), // optional
    billingEmail: text('billing_email'), // optional
    /** Detalle interno por factura Stripe: { [stripeInvoiceId]: { title?, items: [{ id, label, amount }] } } */
    invoiceOverlays: jsonb('invoice_overlays'), // default {}
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const userCompanies = pgTable('user_companies', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }),
    role: text('role').default('member'), // admin, member, owner
    status: text('status').default('active'), // active, inactive
    permissions: jsonb('permissions'), // { projectId: [permissions] }
    isPrimary: boolean('is_primary').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// New Many-to-Many Relationship for Payments and Projects
export const projectPayments = pgTable('project_payments', {
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    paymentId: integer('payment_id').references(() => payments.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.projectId, t.paymentId] }),
}));

// ========== Billing Domain (provider-agnostic) ==========

/** Cuentas de pago por empresa (varios Stripe, MP, PayPal, etc.). Provider = código de payment_provider_config (text). */
export const paymentAccounts = pgTable('payment_accounts', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    provider: text('provider').notNull(),
    label: text('label').notNull(),
    externalId: text('external_id'),
    status: paymentAccountStatusEnum('status').default('active').notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
    companyIdx: index('payment_accounts_company_id_idx').on(t.companyId),
    providerIdx: index('payment_accounts_provider_idx').on(t.provider),
}));

/** Suscripciones de cualquier provider (Stripe, etc.). */
export const subscriptionRecords = pgTable('subscription_records', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    provider: text('provider').notNull(),
    providerSubscriptionId: text('provider_subscription_id'),
    paymentAccountId: uuid('payment_account_id').references(() => paymentAccounts.id, { onDelete: 'set null' }),
    status: subscriptionStatusEnum('status').notNull(),
    currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    amount: integer('amount').notNull(), // minor units
    currency: text('currency').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
    companyIdx: index('subscription_records_company_id_idx').on(t.companyId),
    providerSubIdx: index('subscription_records_provider_sub_id_idx').on(t.providerSubscriptionId),
}));

/** Documentos de cobro (invoice, receipt, credit_note). Fuente de verdad en DB. */
export const billingDocuments = pgTable('billing_documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    type: billingDocumentTypeEnum('type').notNull(),
    provider: text('provider').notNull(),
    providerDocumentId: text('provider_document_id'),
    paymentAccountId: uuid('payment_account_id').references(() => paymentAccounts.id, { onDelete: 'set null' }),
    number: text('number'),
    currency: text('currency').notNull(),
    amountTotal: integer('amount_total').notNull(), // minor units
    amountDue: integer('amount_due').notNull(),
    status: billingDocumentStatusEnum('status').notNull(),
    dueDate: timestamp('due_date', { withTimezone: true }),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    description: text('description'),
    source: billingDocumentSourceEnum('source').notNull(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'set null' }),
    paymentId: integer('payment_id').references(() => payments.id, { onDelete: 'set null' }),
    subscriptionRecordId: uuid('subscription_record_id').references(() => subscriptionRecords.id, { onDelete: 'set null' }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
    companyIdx: index('billing_documents_company_id_idx').on(t.companyId),
    providerDocIdx: index('billing_documents_provider_doc_id_idx').on(t.providerDocumentId),
    statusIdx: index('billing_documents_status_idx').on(t.status),
}));

/** Vínculos de facturas próximas (aún no emitidas) a proyectos. Al sincronizar Stripe se aplican al documento real y se borra la fila. */
export const upcomingInvoiceProjectLinks = pgTable('upcoming_invoice_project_links', {
	id: uuid('id').primaryKey().defaultRandom(),
	companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
	provider: text('provider').notNull(),
	subscriptionId: text('subscription_id').notNull(),
	projectIds: jsonb('project_ids').$type<number[]>().notNull(),
	amountCents: integer('amount_cents'),
	dueDate: timestamp('due_date', { withTimezone: true }),
	currency: text('currency'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
	companyProviderSubIdx: index('upcoming_invoice_project_links_company_provider_sub_idx').on(t.companyId, t.provider, t.subscriptionId),
}));

/** Líneas de detalle por documento (itemización interna + provider). */
export const billingLineItems = pgTable('billing_line_items', {
    id: uuid('id').primaryKey().defaultRandom(),
    billingDocumentId: uuid('billing_document_id').references(() => billingDocuments.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    quantity: numeric('quantity', { precision: 14, scale: 4 }).notNull(),
    unitAmount: integer('unit_amount').notNull(), // minor units
    amount: integer('amount').notNull(), // minor units
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
    documentIdx: index('billing_line_items_document_id_idx').on(t.billingDocumentId),
}));

/** Transacciones de pago (pagos parciales, conciliación). */
export const paymentTransactions = pgTable('payment_transactions', {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }).notNull(),
    billingDocumentId: uuid('billing_document_id').references(() => billingDocuments.id, { onDelete: 'set null' }),
    provider: text('provider').notNull(),
    paymentAccountId: uuid('payment_account_id').references(() => paymentAccounts.id, { onDelete: 'set null' }),
    providerPaymentId: text('provider_payment_id'),
    amount: integer('amount').notNull(), // minor units
    currency: text('currency').notNull(),
    status: paymentTransactionStatusEnum('status').notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    raw: jsonb('raw'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
    companyIdx: index('payment_transactions_company_id_idx').on(t.companyId),
    documentIdx: index('payment_transactions_billing_document_id_idx').on(t.billingDocumentId),
}));

/** Configuración de proveedores de pago (Stripe = automático; resto = carga manual). */
export const paymentProviderConfig = pgTable('payment_provider_config', {
	code: text('code').primaryKey(),
	label: text('label').notNull(),
	isAutomatic: boolean('is_automatic').notNull().default(false),
	displayOrder: integer('display_order').notNull().default(0),
	enabled: boolean('enabled').notNull().default(true),
	/** Datos/direcciones por método: [{ label: "CVU", value: "..." }, { label: "Alias", value: "..." }] */
	details: jsonb('details').$type<{ label: string; value: string }[] | null>(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: text('title').notNull(),
    message: text('message'),
    type: text('type').default('info'), // info, success, warning, error
    link: text('link'),
    metadata: jsonb('metadata'), // Extra data for interactive notifications
    read: boolean('read').default(false),
    archived: boolean('archived').default(false),
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    userIdIdx: index('notifications_user_id_idx').on(t.userId),
}));

// ========== Admin Finance (transactions, categories, attachments) ==========

/** Categorías de finanzas por workspace (ingresos, gastos, etc.). */
export const financeCategories = pgTable('finance_categories', {
    id: serial('id').primaryKey(),
    workspaceId: integer('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    group: text('group').notNull().default('expense'), // income, expense, tax, fees, operations, other
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    workspaceIdx: index('finance_categories_workspace_id_idx').on(t.workspaceId),
}));

/** Transacciones financieras del administrador (no de clientes). */
export const financeTransactions = pgTable('finance_transactions', {
    id: serial('id').primaryKey(),
    workspaceId: integer('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
    date: timestamp('date', { withTimezone: true }).notNull(),
    status: text('status').notNull().default('pending'), // pending, paid, reconciled, overdue
    description: text('description').notNull(),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('USD'),
    type: text('type').notNull(), // income, expense
    categoryId: integer('category_id').references(() => financeCategories.id, { onDelete: 'set null' }),
    bank: text('bank'), // nombre del banco o institución
    paymentMethod: text('payment_method').notNull().default('bank'), // bank, card, wire, cash, other
    cardLabel: text('card_label'), // ej. "Visa ****1234" o "Cuenta corriente"
    /** Empresa o persona de la que se recibe o a la que se hace el pago (opcional). */
    counterparty: text('counterparty'),
    createdBy: integer('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
    workspaceIdx: index('finance_transactions_workspace_id_idx').on(t.workspaceId),
    dateIdx: index('finance_transactions_date_idx').on(t.date),
}));

/** Archivos adjuntos a una transacción (factura, recibo, transferencia, etc.) con descripción. */
export const financeTransactionAttachments = pgTable('finance_transaction_attachments', {
    id: serial('id').primaryKey(),
    transactionId: integer('transaction_id').references(() => financeTransactions.id, { onDelete: 'cascade' }).notNull(),
    fileUrl: text('file_url').notNull(),
    fileName: text('file_name').notNull(),
    description: text('description'), // descripción del archivo
    kind: text('kind').notNull().default('other'), // invoice, receipt, transfer, other
    createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
    transactionIdx: index('finance_transaction_attachments_transaction_id_idx').on(t.transactionId),
}));

export const usersRelations = relations(users, ({ many }) => ({
    userCompanies: many(userCompanies),
    notifications: many(notifications),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
    userCompanies: many(userCompanies),
}));

export const userCompaniesRelations = relations(userCompanies, ({ one }) => ({
    user: one(users, {
        fields: [userCompanies.userId],
        references: [users.id],
    }),
    company: one(companies, {
        fields: [userCompanies.companyId],
        references: [companies.id],
    }),
}));

export const paymentsRelations = relations(payments, ({ many }) => ({
    projectPayments: many(projectPayments),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
    projectPayments: many(projectPayments),
}));

export const projectPaymentsRelations = relations(projectPayments, ({ one }) => ({
    project: one(projects, {
        fields: [projectPayments.projectId],
        references: [projects.id],
    }),
    payment: one(payments, {
        fields: [projectPayments.paymentId],
        references: [payments.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, {
        fields: [notifications.userId],
        references: [users.id],
    }),
}));

export const intakeCasesRelations = relations(intakeCases, ({ many }) => ({
    contacts: many(intakeCaseContacts),
}));

export const intakeCaseContactsRelations = relations(intakeCaseContacts, ({ one }) => ({
    intakeCase: one(intakeCases, {
        fields: [intakeCaseContacts.caseId],
        references: [intakeCases.id],
    }),
}));

// Billing domain relations
export const paymentAccountsRelations = relations(paymentAccounts, ({ one, many }) => ({
    company: one(companies, { fields: [paymentAccounts.companyId], references: [companies.id] }),
    billingDocuments: many(billingDocuments),
    paymentTransactions: many(paymentTransactions),
    subscriptionRecords: many(subscriptionRecords),
}));

export const billingDocumentsRelations = relations(billingDocuments, ({ one, many }) => ({
    company: one(companies, { fields: [billingDocuments.companyId], references: [companies.id] }),
    paymentAccount: one(paymentAccounts, { fields: [billingDocuments.paymentAccountId], references: [paymentAccounts.id] }),
    project: one(projects, { fields: [billingDocuments.projectId], references: [projects.id] }),
    subscriptionRecord: one(subscriptionRecords, { fields: [billingDocuments.subscriptionRecordId], references: [subscriptionRecords.id] }),
    lineItems: many(billingLineItems),
    paymentTransactions: many(paymentTransactions),
}));

export const billingLineItemsRelations = relations(billingLineItems, ({ one }) => ({
    billingDocument: one(billingDocuments, { fields: [billingLineItems.billingDocumentId], references: [billingDocuments.id] }),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
    company: one(companies, { fields: [paymentTransactions.companyId], references: [companies.id] }),
    billingDocument: one(billingDocuments, { fields: [paymentTransactions.billingDocumentId], references: [billingDocuments.id] }),
    paymentAccount: one(paymentAccounts, { fields: [paymentTransactions.paymentAccountId], references: [paymentAccounts.id] }),
}));

export const subscriptionRecordsRelations = relations(subscriptionRecords, ({ one }) => ({
    company: one(companies, { fields: [subscriptionRecords.companyId], references: [companies.id] }),
    paymentAccount: one(paymentAccounts, { fields: [subscriptionRecords.paymentAccountId], references: [paymentAccounts.id] }),
}));

// Admin finance relations
export const financeCategoriesRelations = relations(financeCategories, ({ one }) => ({
    workspace: one(workspaces, { fields: [financeCategories.workspaceId], references: [workspaces.id] }),
}));

export const financeTransactionsRelations = relations(financeTransactions, ({ one, many }) => ({
    workspace: one(workspaces, { fields: [financeTransactions.workspaceId], references: [workspaces.id] }),
    category: one(financeCategories, { fields: [financeTransactions.categoryId], references: [financeCategories.id] }),
    createdByUser: one(users, { fields: [financeTransactions.createdBy], references: [users.id] }),
    attachments: many(financeTransactionAttachments),
}));

export const financeTransactionAttachmentsRelations = relations(financeTransactionAttachments, ({ one }) => ({
    transaction: one(financeTransactions, { fields: [financeTransactionAttachments.transactionId], references: [financeTransactions.id] }),
}));

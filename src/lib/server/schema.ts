import { pgTable, serial, text, timestamp, boolean, integer, jsonb, primaryKey, decimal, char } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
    addresses: jsonb('addresses'), // Array of { label, address, city, country }
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

export const caseComments = pgTable('case_comments', {
    id: serial('id').primaryKey(),
    caseId: integer('case_id').references(() => cases.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    authorName: text('author_name'),
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const requestComments = pgTable('request_comments', {
    id: serial('id').primaryKey(),
    requestId: integer('request_id').references(() => requests.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    authorName: text('author_name'),
    subject: text('subject'),
    content: text('content').notNull(),
    files: jsonb('files'),
    createdAt: timestamp('created_at').defaultNow(),
});

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
});

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
    exchangeRate: decimal('exchange_rate', { precision: 14, scale: 6 }),
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
});

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
    registrationDetails: jsonb('registration_details'), // { acn, abn, ndisRegistration }
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const userCompanies = pgTable('user_companies', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
    companyId: integer('company_id').references(() => companies.id, { onDelete: 'cascade' }),
    role: text('role').default('member'), // admin, member, owner
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

export const usersRelations = relations(users, ({ many }) => ({
    userCompanies: many(userCompanies),
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

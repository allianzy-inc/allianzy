import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const workspaces = pgTable('workspaces', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    role: text('role').default('staff'), // staff, client, provider
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

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').default('Pending'),
    provider: text('provider').default('Allianzy'), // Allianzy, Beltrix, Provider
    serviceId: integer('service_id').references(() => services.id),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const cases = pgTable('cases', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending'),
    priority: text('priority').default('medium'), // low, medium, high
    projectId: integer('project_id').references(() => projects.id),
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const requirements = pgTable('requirements', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending'), // pending, approved, rejected
    documentUrl: text('document_url'),
    projectId: integer('project_id').references(() => projects.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const proposals = pgTable('project_proposals', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').default('pending'), // pending, approved, rejected
    documentUrl: text('document_url'),
    projectId: integer('project_id').references(() => projects.id),
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
    projectId: integer('project_id').references(() => projects.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const projectMilestones = pgTable('project_milestones', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    status: text('status').default('pending'), // pending, in_progress, completed
    order: integer('order').notNull(),
    projectId: integer('project_id').references(() => projects.id),
    completedAt: timestamp('completed_at'),
});


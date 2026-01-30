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
    clientId: text('client_id').notNull(), // References Neon Auth User ID (UUID string)
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').default('Pending'),
    serviceId: integer('service_id').references(() => services.id),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const cases = pgTable('cases', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    status: text('status').default('pending'),
    workspaceId: integer('workspace_id').references(() => workspaces.id),
    createdAt: timestamp('created_at').defaultNow(),
});


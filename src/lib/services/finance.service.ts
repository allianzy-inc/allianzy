import { writable, get } from 'svelte/store';

// --- Types ---

export type Currency = 'USD' | 'UYU' | 'ARS' | 'EUR' | 'GBP';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'pending' | 'paid' | 'reconciled' | 'overdue';
export type PaymentMethod = 'bank' | 'card' | 'cash' | 'wire' | 'other';

export interface Transaction {
    id: string;
    orgId: string;
    projectId?: string;
    date: string; // ISO string
    type: TransactionType;
    amount: number;
    currency: Currency;
    fxRate?: number;
    amountBase?: number;
    categoryId: string;
    vendorId?: string;
    paymentMethod: PaymentMethod;
    status: TransactionStatus;
    notes?: string;
    attachmentUrl?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
}

export interface RecurringPayment {
    id: string;
    orgId: string;
    projectId?: string;
    name: string;
    vendorId?: string;
    categoryId?: string;
    amount: number;
    currency: Currency;
    frequency: 'monthly' | 'quarterly' | 'yearly';
    nextDueDate: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'paused';
    reminderDays: number[];
}

export interface Obligation {
    id: string;
    orgId: string;
    name: string;
    jurisdiction: 'US-DE' | 'AR' | 'UY' | 'UK' | 'other';
    dueDate: string;
    amountEstimate?: number;
    currency: Currency;
    linkUrl?: string;
    description?: string;
    status: 'planned' | 'in_progress' | 'submitted' | 'paid' | 'overdue';
    tags: string[];
}

export interface Vendor {
    id: string;
    orgId: string;
    name: string;
    email?: string;
    phone?: string;
    notes?: string;
}

export interface FinanceCategory {
    id: string;
    orgId: string;
    name: string;
    group: 'income' | 'expense' | 'tax' | 'fees' | 'operations' | 'other';
}

// --- Mock Data Stores ---

const transactionsStore = writable<Transaction[]>([]);
const recurringStore = writable<RecurringPayment[]>([]);
const obligationsStore = writable<Obligation[]>([]);
const vendorsStore = writable<Vendor[]>([]);
const categoriesStore = writable<FinanceCategory[]>([]);

// --- Helper: Delay ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Service ---

export const financeService = {
    // --- Transactions ---
    async getTransactions(filters: any = {}): Promise<Transaction[]> {
        await delay(500);
        let data = get(transactionsStore);
        // Simple filter application (mock)
        if (filters.type) data = data.filter(t => t.type === filters.type);
        if (filters.status) data = data.filter(t => t.status === filters.status);
        return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    async createTransaction(tx: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
        await delay(300);
        const newTx: Transaction = {
            ...tx,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        transactionsStore.update(items => [newTx, ...items]);
        return newTx;
    },

    async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
        await delay(300);
        let updated: Transaction | undefined;
        transactionsStore.update(items => items.map(t => {
            if (t.id === id) {
                updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
                return updated;
            }
            return t;
        }));
        if (!updated) throw new Error('Transaction not found');
        return updated;
    },

    async deleteTransaction(id: string): Promise<void> {
        await delay(300);
        transactionsStore.update(items => items.filter(t => t.id !== id));
    },

    // --- Recurring Payments ---
    async getRecurringPayments(): Promise<RecurringPayment[]> {
        await delay(400);
        return get(recurringStore);
    },

    async createRecurringPayment(item: Omit<RecurringPayment, 'id'>): Promise<RecurringPayment> {
        await delay(300);
        const newItem: RecurringPayment = { ...item, id: crypto.randomUUID() };
        recurringStore.update(items => [...items, newItem]);
        return newItem;
    },

    // --- Obligations ---
    async getObligations(): Promise<Obligation[]> {
        await delay(400);
        return get(obligationsStore);
    },

    async createObligation(item: Omit<Obligation, 'id'>): Promise<Obligation> {
        await delay(300);
        const newItem: Obligation = { ...item, id: crypto.randomUUID() };
        obligationsStore.update(items => [...items, newItem]);
        return newItem;
    },

    // --- Vendors ---
    async getVendors(): Promise<Vendor[]> {
        await delay(200);
        return get(vendorsStore);
    },

    async createVendor(item: Omit<Vendor, 'id'>): Promise<Vendor> {
        await delay(200);
        const newItem: Vendor = { ...item, id: crypto.randomUUID() };
        vendorsStore.update(items => [...items, newItem]);
        return newItem;
    },

    // --- Categories ---
    async getCategories(): Promise<FinanceCategory[]> {
        await delay(200);
        return get(categoriesStore);
    },

    // --- Initialization / Seeding ---
    initMockData() {
        const orgId = 'org-1';

        // Categories
        if (get(categoriesStore).length === 0) {
            categoriesStore.set([
                { id: 'c1', orgId, name: 'Client Payments', group: 'income' },
                { id: 'c2', orgId, name: 'Consulting Fees', group: 'income' },
                { id: 'c3', orgId, name: 'Contractors', group: 'expense' },
                { id: 'c4', orgId, name: 'Software Subscriptions', group: 'expense' },
                { id: 'c5', orgId, name: 'Hosting/VPS', group: 'expense' },
                { id: 'c6', orgId, name: 'Ads/Marketing', group: 'expense' },
                { id: 'c7', orgId, name: 'Delaware Fees', group: 'tax' },
                { id: 'c8', orgId, name: 'Government Filing Fees', group: 'tax' },
            ]);
        }

        // Obligations
        if (get(obligationsStore).length === 0) {
            obligationsStore.set([
                { id: 'o1', orgId, name: 'Delaware Annual Report', jurisdiction: 'US-DE', dueDate: '2024-06-01', currency: 'USD', amountEstimate: 450, status: 'planned', tags: ['tax', 'compliance'] },
                { id: 'o2', orgId, name: 'ITIN Application', jurisdiction: 'US-DE', dueDate: '2024-09-01', currency: 'USD', status: 'planned', tags: ['tax'] },
                { id: 'o3', orgId, name: 'Monthly Bookkeeping', jurisdiction: 'US-DE', dueDate: '2024-03-01', currency: 'USD', amountEstimate: 200, status: 'in_progress', tags: ['accounting'] },
            ]);
        }

        // Vendors
        if (get(vendorsStore).length === 0) {
            vendorsStore.set([
                { id: 'v1', orgId, name: 'DigitalOcean' },
                { id: 'v2', orgId, name: 'Google Workspace' },
                { id: 'v3', orgId, name: 'Upwork' },
            ]);
        }

        // Transactions
        if (get(transactionsStore).length === 0) {
            transactionsStore.set([
                { 
                    id: 't1', orgId, date: new Date().toISOString(), type: 'expense', amount: 50, currency: 'USD', 
                    categoryId: 'c5', vendorId: 'v1', paymentMethod: 'card', status: 'paid', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() 
                },
                { 
                    id: 't2', orgId, date: new Date(Date.now() - 86400000 * 2).toISOString(), type: 'income', amount: 5000, currency: 'USD', 
                    categoryId: 'c1', paymentMethod: 'wire', status: 'reconciled', notes: 'Project Alpha Downpayment', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() 
                },
                { 
                    id: 't3', orgId, date: new Date(Date.now() - 86400000 * 5).toISOString(), type: 'expense', amount: 1200, currency: 'USD', 
                    categoryId: 'c3', vendorId: 'v3', paymentMethod: 'wire', status: 'pending', notes: 'Frontend Dev Contract', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() 
                },
            ]);
        }
    }
};

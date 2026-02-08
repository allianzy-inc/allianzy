import { writable } from 'svelte/store';

export type FinanceRole = 'admin' | 'accountant' | 'client_owner' | 'collaborator';

// Default to 'admin' for development/demo purposes
// In a real app, this would be derived from the user's session/permissions
export const financeRole = writable<FinanceRole>('admin');

export const canEditFinance = (role: FinanceRole) => ['admin', 'accountant'].includes(role);
export const canViewFinance = (role: FinanceRole) => ['admin', 'accountant', 'client_owner'].includes(role);

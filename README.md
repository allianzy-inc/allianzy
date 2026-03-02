# Allianzy Inc & Beltix SaaS:


A multi-tenant SaaS dashboard UI built with SvelteKit and Shadcn UI.

## Features

- **Multi-tenancy**: Separate workspaces for `Allianzy` and `Beltix Agency`.
- **Role-based UI**: Client Portal, Staff Dashboard, Provider Portal.
- **Intake Form**: Guided multi-step intake process.
- **Backoffice**: Admin pipeline for managing cases.
- **Ticketing**: Support ticket system.
- **Scheduling**: Calendly integration placeholder.
- **Payments**: Subscription and service tracking.
- **Branding**: Configurable workspace branding.

## Structure

- `/` - Root landing page to select workspace.
- `/[workspace]/` - Public landing page for the workspace.
- `/[workspace]/auth/login` - Authentication.
- `/[workspace]/dashboard` - Main staff/admin dashboard.
- `/[workspace]/portal` - Client portal.
- `/[workspace]/intake` - Client intake form.
- `/[workspace]/admin/cases` - Case management.
- `/[workspace]/provider` - Provider task list.
- `/[workspace]/tickets` - Support tickets.
- `/[workspace]/config` - Workspace settings.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

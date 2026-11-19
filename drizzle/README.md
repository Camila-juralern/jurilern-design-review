# JuriLern gameplay features

This migration adds persistent avatar clothing/accessory inventory, room surface/decor customization, and a session history table.

Before deploying the app update, run `drizzle/0002_jurilern_gameplay.sql` against the same PostgreSQL database configured by `DATABASE_URL`. Then deploy the commit. The app uses the existing `/api/jl/*` endpoints and PostgreSQL state so room members see shared scores and room customizations across devices.

# myFinance — Project Summary

## Overview

myFinance is a personal finance management web application built with Next.js (App Router) and TypeScript. It provides authenticated users with a dashboard to track balances, income, expenses, and next-step guidance while relying on Firebase for authentication and data services.

## Architecture

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui components.
- **State & Logic:** React Context providers and custom hooks for auth and UI state.
- **Backend Services:** Firebase Auth and Firestore accessed through modular service layers.
- **Validation:** Zod schemas for input validation and consistent error formatting.

## Key Features

- Authentication flows with email/password and Google sign-in.
- Localized UI (EN and PT‑PT) with a language switch in the header.
- Theme color presets via CSS variables and class-based overrides.
- Dashboard widgets and guidance cards to onboard new users.
- Finance workspace with initial balance, categories, and transaction forms.
- Summary charts (income vs expenses, expenses by category) and transaction table.

## Project Structure

- `app/`: Next.js routes, layouts, and API endpoints.
- `components/`: UI, layout, and provider components.
- `lib/`: Firebase integrations, hooks, services, and validation logic.
- `types/`: Shared TypeScript types.

## Usage Notes

The UI text is translated through the i18n provider, and colors can be swapped by applying a theme class (e.g. `theme-emerald`) at any container level. Transaction data is stored per user under Firestore collections (users/{uid}/transactions and users/{uid}/categories).

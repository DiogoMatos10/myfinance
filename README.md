# myFinance - Personal Finance Management Platform

## 📋 Project Overview

**myFinance** is an open-source personal finance management application built with modern web technologies. It helps users track their earnings, expenses, investments (stocks, ETFs, crypto), and provides comprehensive financial insights through interactive dashboards.

### 🎯 Mission

Empower individuals to take control of their financial life through an intuitive, privacy-focused, and completely free platform.

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **State Management:** React Context + Custom Hooks

**Backend:**

- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Email/Password, Google OAuth)
- **Hosting:** Netlify
- **API Routes:** Next.js API Routes

**Development Tools:**

- **Code Quality:** ESLint, Prettier, Husky
- **Git Hooks:** lint-staged, commitlint
- **CI/CD:** GitHub Actions
- **Version Control:** Git & GitHub

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Landing  │  │Dashboard │  │Investment│  │ Profile  │     │
│  │   Page   │  │   Page   │  │   Page   │  │   Page   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT LAYER                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │UI Component│  │  Feature   │  │  Layout    │             │
│  │ (shadcn/ui)│  │ Components │  │ Components │             │
│  └────────────┘  └────────────┘  └────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  Services  │  │Custom Hooks│  │ Validations│             │
│  │   Layer    │  │   Layer    │  │   (Zod)    │             │
│  └────────────┘  └────────────┘  └────────────┘             │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  Firebase  │  │  Firebase  │  │ API Routes │             │
│  │    Auth    │  │ Firestore  │  │ (Next.js)  │             │
│  └────────────┘  └────────────┘  └────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Application Structure

### 1. Landing Page

**Route:** `/`

**Features:**

- Hero section with personalized greeting
- Display: "Hello, [User Name]!" (after login)
- Value proposition and key features
- Call-to-action buttons (Get Started, Login)
- Feature highlights with icons
- Open-source badge and GitHub link

**Components:**

- `Hero` - Main banner with greeting
- `FeatureCard` - Showcase key features
- `CTASection` - Call to action
- `Footer` - Links and information

---

### 2. Dashboard (Main)

**Route:** `/dashboard`

**Overview Widgets:**

1. **Total Balance Card**
   - Current balance
   - Month-over-month change
   - Visual indicator (up/down)

2. **Quick Stats**
   - Total Income (current month)
   - Total Expenses (current month)
   - Savings Rate (%)
   - Net Worth

3. **Recent Transactions**
   - Last 10 transactions
   - Quick filters (All, Income, Expense)
   - Add transaction button

4. **Spending by Category**
   - Pie/Donut chart
   - Top 5 categories
   - View all link

5. **Monthly Trend**
   - Line chart (Income vs Expenses)
   - Last 6 months
   - Forecast indicator

**Components:**

- `BalanceCard`
- `StatsGrid`
- `TransactionList`
- `CategoryChart`
- `TrendChart`

---

### 3. Earnings & Expenses

**Route:** `/transactions`

**Features:**

**Transaction Management:**

- Add new transaction (modal/drawer)
- Edit/Delete transactions
- Bulk operations
- Import from CSV

**Filtering & Search:**

- Date range picker
- Category filter
- Type filter (Income/Expense)
- Amount range
- Search by description

**Views:**

- Table view (default)
- Card view
- Calendar view

**Analytics:**

- Monthly breakdown
- Category analysis
- Trend analysis
- Export to PDF/CSV

**Components:**

- `TransactionForm`
- `TransactionTable`
- `FilterPanel`
- `TransactionCard`
- `CategoryBreakdown`

---

### 4. Investments Dashboard

**Route:** `/investments`

**Sub-sections:**

#### 4.1 Portfolio Overview

- Total portfolio value
- Total gain/loss ($, %)
- Asset allocation (Stocks, ETFs, Crypto)
- Diversification score

#### 4.2 Stocks

- Stock holdings list
- Real-time prices (via API)
- Gain/loss per stock
- Add/Edit/Remove stocks
- Performance charts

#### 4.3 ETFs (Exchange-Traded Funds)

- ETF holdings list
- Sector exposure
- Dividend tracking
- Performance metrics

#### 4.4 Cryptocurrency

- Crypto holdings
- Live prices (CoinGecko API)
- 24h change
- Portfolio percentage
- Price alerts (future feature)

**Data Structure:**

```typescript
interface Investment {
  id: string;
  userId: string;
  type: 'stock' | 'etf' | 'crypto';
  symbol: string;
  name: string;
  quantity: number;
  avgPurchasePrice: number;
  currentPrice: number;
  currency: string;
  purchaseDate: Date;
  notes?: string;
}
```

**Components:**

- `PortfolioSummary`
- `AssetAllocationChart`
- `StockTable`
- `ETFTable`
- `CryptoTable`
- `InvestmentForm`
- `PriceChart`

**External APIs (Free Tier):**

- **Stocks/ETFs:** Alpha Vantage (500 requests/day)
- **Crypto:** CoinGecko API (free, no key required)

---

### 5. Reports & Analytics

**Route:** `/reports`

**Report Types:**

1. **Monthly Reports**
   - Income vs Expenses
   - Savings rate
   - Top spending categories
   - Budget adherence

2. **Yearly Summary**
   - Annual income
   - Annual expenses
   - Net savings
   - Investment returns

3. **Category Analysis**
   - Spending trends by category
   - Comparison across months
   - Anomaly detection

4. **Investment Performance**
   - ROI per investment
   - Portfolio performance
   - Asset allocation over time

**Components:**

- `ReportCard`
- `DateRangePicker`
- `ComparisonChart`
- `ExportButton`

---

### 6. Profile Page

**Route:** `/profile`

**Sections:**

1. **Personal Information**
   - Display name
   - Email
   - Profile picture
   - Account created date

2. **Account Statistics**
   - Total transactions
   - Account age
   - Active investments
   - Data usage

3. **Preferences**
   - Default currency
   - Date format
   - Number format
   - Language (future)

4. **Security**
   - Change password
   - Two-factor authentication (future)
   - Active sessions
   - Login history

**Components:**

- `ProfileHeader`
- `PersonalInfoForm`
- `StatsCard`
- `PreferencesForm`
- `SecuritySettings`

---

### 7. Settings

**Route:** `/settings`

**Categories:**

#### 7.1 General Settings

- Display name
- Email notifications
- App theme (Light/Dark/System)
- Default dashboard view

#### 7.2 Categories Management

- Add custom categories
- Edit/Delete categories
- Category icons and colors
- Budget limits per category

#### 7.3 Budget Settings

- Monthly budget
- Category budgets
- Alert thresholds
- Budget period

#### 7.4 Data Management

- Export all data (JSON/CSV)
- Import data
- Clear transaction history
- Account deletion

#### 7.5 Notifications

- Email notifications
- Budget alerts
- Investment alerts
- Weekly summary

**Components:**

- `SettingsNav`
- `SettingSection`
- `CategoryManager`
- `BudgetForm`
- `DataExport`

---

## 🗄️ Database Schema

### Firestore Collections

#### 1. `users`

```typescript
{
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  defaultCurrency: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    notifications: boolean;
  };
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### 2. `transactions`

```typescript
{
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: timestamp;
  paymentMethod?: string;
  tags?: string[];
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### 3. `categories`

```typescript
{
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
  budget?: number;
  isDefault: boolean;
  createdAt: timestamp;
}
```

#### 4. `investments`

```typescript
{
  id: string;
  userId: string;
  type: 'stock' | 'etf' | 'crypto';
  symbol: string;
  name: string;
  quantity: number;
  avgPurchasePrice: number;
  currency: string;
  purchaseDate: timestamp;
  notes?: string;
  createdAt: timestamp;
  updatedAt: timestamp;
}
```

#### 5. `budgets`

```typescript
{
  id: string;
  userId: string;
  month: string; // 'YYYY-MM'
  totalBudget: number;
  categoryBudgets: {
    [categoryId: string]: number;
  };
  alerts: boolean;
  createdAt: timestamp;
}
```

---

## 🔐 Security & Privacy

### Authentication Flow

1. User registers/logs in via Firebase Auth
2. JWT token stored securely
3. Token validated on protected routes
4. Session management with auto-refresh

### Data Privacy

- All user data is private and isolated
- Firestore security rules enforce user-level access
- No data sharing with third parties
- Optional data export in standard formats

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /transactions/{transactionId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /investments/{investmentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /categories/{categoryId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 🚀 Development Roadmap

### Phase 1: MVP (Weeks 1-4) ✅ Current

- [x] Project setup and configuration
- [x] Authentication system
- [ ] Landing page with greeting
- [ ] Basic transaction CRUD
- [ ] Simple dashboard
- [ ] Category management

### Phase 2: Core Features (Weeks 5-8)

- [ ] Advanced transaction filtering
- [ ] Budget tracking
- [ ] Monthly reports
- [ ] Profile page
- [ ] Settings page
- [ ] Data export

### Phase 3: Investments (Weeks 9-12)

- [ ] Investment tracking (Stocks)
- [ ] ETF management
- [ ] Cryptocurrency tracking
- [ ] Portfolio analytics
- [ ] API integration for prices
- [ ] Investment charts

### Phase 4: Advanced Analytics (Weeks 13-16)

- [ ] Advanced reports
- [ ] Forecasting
- [ ] Budget recommendations
- [ ] Spending insights
- [ ] Export to PDF
- [ ] Custom date ranges

### Phase 5: Polish & Launch (Weeks 17-20)

- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] PWA features
- [ ] Dark mode refinement
- [ ] Documentation
- [ ] Open source release

### Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Bank integration (Plaid)
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Collaborative budgets
- [ ] AI-powered insights
- [ ] Receipt scanning

---

## 🎨 Design System

### Color Palette

```css
/* Light Mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96.1%;
--accent: 210 40% 96.1%;
--destructive: 0 84.2% 60.2%;

/* Dark Mode */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--primary: 217.2 91.2% 59.8%;
```

### Typography

- **Headings:** Inter (Bold)
- **Body:** Inter (Regular)
- **Monospace:** JetBrains Mono

### Components Style Guide

- **Cards:** Rounded corners (12px), subtle shadow
- **Buttons:** Primary (solid), Secondary (outline), Ghost
- **Forms:** Clean labels, inline validation
- **Tables:** Striped rows, hover effects
- **Charts:** Consistent color scheme, interactive tooltips

---

## 📊 Key Features Summary

| Feature                | Description            | Priority | Status         |
| ---------------------- | ---------------------- | -------- | -------------- |
| User Authentication    | Login, Register, OAuth | High     | ✅ Setup       |
| Transaction Management | CRUD operations        | High     | 🟡 In Progress |
| Dashboard              | Overview widgets       | High     | 🟡 In Progress |
| Categories             | Custom categories      | Medium   | 📋 Planned     |
| Budget Tracking        | Monthly budgets        | Medium   | 📋 Planned     |
| Investment Tracking    | Stocks, ETFs, Crypto   | Medium   | 📋 Planned     |
| Reports                | Analytics & insights   | Medium   | 📋 Planned     |
| Profile Management     | User settings          | Low      | 📋 Planned     |
| Data Export            | CSV, JSON, PDF         | Low      | 📋 Planned     |
| Dark Mode              | Theme switching        | Low      | 📋 Planned     |

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Firebase account (free tier)
- Netlify account (free tier)

### Initial Setup

#### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/myfinance.git
cd myfinance

# Install dependencies
npm install
```

#### 2. Environment Variables

Create `.env.local` file in root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### 3. Firebase Setup

```bash
# Install Firebase CLI (optional)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init
# Select: Firestore, Hosting, Storage
```

**Configure Firestore Security Rules** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /transactions/{transactionId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /investments/{investmentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /categories/{categoryId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    match /budgets/{budgetId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

---

## 🔧 Code Quality Setup

### 1. Install All Dependencies

```bash
# Code quality tools
npm install -D eslint prettier eslint-config-prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Git hooks
npm install -D husky lint-staged

# Commit linting
npm install -D @commitlint/cli @commitlint/config-conventional

# Dependency checking
npm install -D depcheck madge

# Bundle analysis
npm install -D @next/bundle-analyzer
```

### 2. ESLint Configuration

Create/Update `eslint.config.mjs`:

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',
    },
  },
];

export default eslintConfig;
```

### 3. Prettier Configuration

Create `.prettierrc.json`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

Create `.prettierignore`:

```
node_modules
.next
out
build
dist
coverage
*.lock
package-lock.json
yarn.lock
pnpm-lock.yaml
.env*
```

### 4. Lint-Staged Configuration

Create `.lintstagedrc.js`:

```javascript
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml,css,scss}': ['prettier --write'],
};
```

### 5. CommitLint Configuration

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting)
        'refactor', // Code refactoring
        'perf', // Performance improvements
        'test', // Adding or updating tests
        'build', // Build system changes
        'ci', // CI/CD changes
        'chore', // Other changes (maintenance)
        'revert', // Revert a commit
      ],
    ],
    'subject-case': [0], // Allow any case for subject
  },
};
```

### 6. Husky Setup (v9+)

```bash
# Initialize Husky
npx husky init

# This creates .husky/ folder with pre-commit hook
```

**Update `.husky/pre-commit`:**

```bash
npx lint-staged
```

**Create `.husky/commit-msg`:**

Windows (PowerShell):

```powershell
New-Item -Path .husky/commit-msg -ItemType File -Force
Set-Content -Path .husky/commit-msg -Value "npx --no -- commitlint --edit `$1"
```

Mac/Linux:

```bash
echo 'npx --no -- commitlint --edit $1' > .husky/commit-msg
chmod +x .husky/commit-msg
```

**Create `.husky/pre-push`** (optional):

Windows (PowerShell):

```powershell
New-Item -Path .husky/pre-push -ItemType File -Force
Set-Content -Path .husky/pre-push -Value "npm run type-check"
```

Mac/Linux:

```bash
echo 'npm run type-check' > .husky/pre-push
chmod +x .husky/pre-push
```

### 7. Update package.json Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "prepare": "husky",
    "check:deps": "depcheck",
    "check:circular": "madge --circular --extensions ts,tsx ./app ./components ./lib",
    "analyze": "ANALYZE=true npm run build",
    "check:all": "npm run lint && npm run type-check && npm run check:deps"
  }
}
```

### 8. Bundle Analyzer Setup

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Your existing config
};

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
```

Run analysis:

```bash
npm run analyze
```

---

## 🚀 CI/CD Setup

### GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality-check:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Prettier check
        run: npm run format:check

      - name: Run ESLint
        run: npm run lint

      - name: TypeScript type check
        run: npm run type-check

      - name: Check for circular dependencies
        run: npm run check:circular

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}

  # Future: Add test job
  # test:
  #   runs-on: ubuntu-latest
  #   steps:
  #     - uses: actions/checkout@v4
  #     - uses: actions/setup-node@v4
  #       with:
  #         node-version: '18'
  #     - run: npm ci
  #     - run: npm test
```

### GitHub Secrets Setup

Go to GitHub Repository → Settings → Secrets → Actions → New repository secret

Add these secrets:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

---

## 🌐 Netlify Deployment

### 1. Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# Redirect rules for client-side routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"

# Cache static assets
[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Deploy to Netlify

**Option A: Via Netlify Dashboard**

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables (same as GitHub secrets)
6. Click "Deploy site"

**Option B: Via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### 3. Environment Variables on Netlify

Site settings → Environment variables → Add variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4. Branch Deploys

Netlify automatically creates preview deploys for:

- **Production:** `main` branch → yoursite.netlify.app
- **Preview:** Pull requests → deploy-preview-123.netlify.app
- **Staging:** `develop` branch → develop--yoursite.netlify.app

---

## 📝 VSCode Setup (Recommended)

### 1. Install Extensions

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- GitLens
- Error Lens
- Pretty TypeScript Errors

### 2. Create `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### 3. Create `.vscode/extensions.json`

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "eamodio.gitlens",
    "usernamehw.errorlens",
    "yoavbls.pretty-ts-errors"
  ]
}
```

---

## 🧪 Testing Setup (Future)

### Install Testing Libraries

```bash
# Jest and React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jest-environment-jsdom

# Playwright for E2E
npm install -D @playwright/test
```

### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)

---

## 📞 Contact & Links

- **GitHub:** [github.com/yourusername/myfinance](https://github.com)
- **Documentation:** [docs.myfinance.com](https://docs.myfinance.com)
- **Issues:** [github.com/yourusername/myfinance/issues](https://github.com)
- **Discussions:** [github.com/yourusername/myfinance/discussions](https://github.com)

---

## 📄 License

MIT License - Free and open source forever.

---

**Built with ❤️ by the myFinance Team**

*Last updated: November 2025*: '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
```

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Lint check
npm run lint

# 2. Format check
npm run format:check

# 3. Type check
npm run type-check

# 4. Check for circular dependencies
npm run check:circular

# 5. Check for unused dependencies
npm run check:deps

# 6. Build project
npm run build

# 7. Run dev server
npm run dev

# 8. Test commit message format (should fail)
git commit -m "bad message"
# ❌ Should fail commitlint

# 9. Test correct format (should pass)
git commit -m "feat: add new feature"
# ✅ Should pass
```

---

## 🤝 Contributing

This is an open-source project! Contributions are welcome.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

### Development Workflow

1. Pull latest `main` branch
2. Create feature branch from `main`
3. Make changes (format on save enabled)
4. Commit with conventional format (husky validates)
5. Push to your fork
6. Create PR (CI runs automatically)
7. Wait for review and approval
8. Merge to `main` (auto-deploys to Netlify)

---

## 📞 Contact & Links

- **GitHub:** [github.com/yourusername/myfinance](https://github.com)
- **Documentation:** [docs.myfinance.com](https://docs.myfinance.com)
- **Issues:** [github.com/yourusername/myfinance/issues](https://github.com)
- **Discussions:** [github.com/yourusername/myfinance/discussions](https://github.com)

---

## 📄 License

MIT License - Free and open source forever.

---

**Built with ❤️ by the myFinance Team**

_Last updated: November 2025_

# Synmet - Development Activity Tracking Platform

**Synmet** is an open-source, SaaS-managed, and self-hosted development activity tracking platform with a strong emphasis on privacy and self-owned data.

## 🎯 Vision

Provide developers with a private, flexible, and transparent way to monitor their productivity and coding metrics without compromising their coding data.

## ✨ Core Features

- **📊 Heartbeat Tracking:** Detailed recording of coding activity
  - File/entity being edited
  - Git project and branch information
  - Programming language used
  - Coding duration and timestamps
  - Activity type (coding, debugging, testing, etc.)
  - AI-assisted development time tracking

- **📈 Analytics & Metrics:** Intuitive visualization of productivity patterns
  - Total coding time per day/week/month
  - Most-used programming languages
  - Streak of active days
  - Metrics per project
  - Export capabilities (GitHub, Images, PDF, JSON, CSV)
  - API consumption tracking

- **🔐 Privacy First:** 100% self-hosted
  - Your data stays in your infrastructure
  - Complete control over your data
  - No external telemetry or tracking

- **🌍 Multi-language Support:** Full support for multiple languages
  - Spanish (es)
  - English (en)
  - Português (pt)
  - More coming soon...

- **🔑 API Keys:** Integration with code editors
  - VS Code plugin (coming soon)
  - JetBrains IDEs plugin (coming soon)
  - Neovim plugin (coming soon)

## 🛠️ Tech Stack

This project is built with modern and robust technologies:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, RSC)
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5+
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Prisma Postgres](https://www.prisma.io/postgres)
- **ORM:** [Prisma 7](https://www.prisma.io/) with Accelerate
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)
- **UI Framework:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/react/overview/quick-start)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Validation:** [Zod](https://zod.dev/)
- **i18n:** [next-intl](https://next-intl.dev/)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/) + Docker
- **Linting:** [ESLint](https://eslint.org/) with [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+ (local or remote)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/synmet.git
cd synmet
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy and complete the environment file:

```bash
# For local development
cp .dev.vars.example .dev.vars

# Edit .dev.vars with your actual values
```

**Required variables in `.dev.vars`:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/synmet_dev"

# NextAuth
NEXTAUTH_SECRET="openssl rand -hex 32"  # Generate with: openssl rand -hex 32
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
```

### 4. Configure the Database

```bash
# Generate Prisma client
pnpm generate

# Run migrations
pnpm migrate

# (Optional) Load test data
pnpm prisma db seed
```

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
synmet/
├── src/                       # Source code
│   ├── app/                   # Next.js App Router
│   │   ├── [locale]/          # i18n routing layer
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── auth/
│   │   │   ├── settings/
│   │   │   └── .../
│   │   └── api/                # API routes
│   │       ├── auth/           # Authentication
│   │       ├── heartbeat/      # Heartbeat tracking
│   │       ├── api-keys/       # API key management
│   │       ├── subscription/   # SaaS subscription
│   │       └── .../
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   ├── dashboard/         # Dashboard components
│   │   └── .../
│   ├── lib/                   # Utilities & services
│   │   ├── auth.ts            # Authentication logic
│   │   ├── subscription.ts    # SaaS subscription service
│   │   ├── ai-usage.ts        # AI usage tracking
│   │   ├── plan.ts            # Plan definitions
│   │   ├── validations/       # Zod schemas
│   │   └── .../
│   ├── i18n/                  # Internationalization config
│   ├── styles/                # Global styles
│   └── middleware.ts          # Next.js middleware
├── messages/                  # i18n translation files
│   ├── es.json
│   ├── en.json
│   └── pt.json
├── prisma/                    # Database
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # DB migrations
│   └── .../
├── docs/                      # Documentation
│   ├── SAAS-REFORMA-PLAN.md
│   ├── TEST-PLAN.md
│   └── .../
├── public/                    # Static assets
├── .github/workflows/         # CI/CD pipelines
├── Dockerfile                 # Container setup
├── docker-compose.yml         # Docker services
├── next.config.ts             # Next.js config
├── wrangler.jsonc             # Cloudflare Workers
└── .../
```

## 🔐 Authentication

### GitHub OAuth Setup

1. Go to [GitHub Settings → Developer Settings → OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following:
   - **Application name:** Synmet
   - **Homepage URL:** http://localhost:3000 (local) or https://synmet.dev (production)
   - **Authorization callback URL:** http://localhost:3000/api/auth/callback/github
4. Copy `Client ID` and `Client Secret` to `.dev.vars`

### Protected Routes

Routes under `/dashboard` and `/[locale]/dashboard` require user authentication. Unauthenticated requests are redirected to the sign-in page.

## 🌍 Internationalization

The project supports multiple languages using `next-intl`:

```
messages/
├── es.json  # Spanish
├── en.json  # English
└── pt.json  # Portuguese
```

Language is automatically detected from the URL: `/es/`, `/en/`, `/pt/`

Default language is English. Users can switch languages by changing the URL prefix.

## 📊 Database

### Core Models

- **User:** System users with roles and sessions
- **Account:** OAuth accounts (NextAuth integration)
- **Session:** Authentication sessions
- **ApiKey:** API keys for editor plugins
- **Project:** User projects for organizing heartbeats
- **Heartbeat:** Individual coding activity records
- **DailyMetrics:** Aggregated daily metrics per user/project

### Key Relations

- User → has many ApiKeys, Projects, Heartbeats, DailyMetrics
- Project → belongs to User, has many Heartbeats
- Heartbeat → belongs to User and Project
- ApiKey → belongs to User

See [prisma/schema.prisma](/prisma/schema.prisma) for complete schema details.

## 🚀 Deployment

### To Cloudflare Workers

```bash
# Build and deploy
pnpm deploy
```

Requirements:
- Cloudflare account with Workers enabled
- Environment variables configured in Wrangler

### GitHub Actions CI/CD

The project includes an automated CI/CD pipeline:

- ✅ Lint and type-check on PRs
- ✅ Build on each push to main
- ✅ Automatic deploy to Cloudflare (main branch)
- ✅ Docker image build and push

## 📝 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues

# Prisma
pnpm generate         # Generate Prisma client
pnpm migrate          # Run database migrations
pnpm studio           # Open Prisma Studio

# Deployment
pnpm preview          # Preview before deployment
pnpm deploy           # Deploy to Cloudflare
pnpm upload           # Upload to Cloudflare
```

## 🛣️ Roadmap

### Iteration 2 (Planned)

- [ ] Real-time heartbeat collection
- [ ] Interactive activity charts
- [ ] Enhanced project management
- [ ] User profile customization

### Iteration 3 (Planned)

- [ ] VS Code extension
- [ ] JetBrains IDE plugin
- [ ] Neovim plugin

### Iteration 4 (Planned)

- [ ] Stripe payment system
- [ ] Subscription plans
- [ ] Team management

### Iteration 5+ (Future)

- [ ] Share metrics publicly
- [ ] Slack and Discord integrations
- [ ] Custom webhooks
- [ ] Data export features

## ⚠️ Known Issues & Technical Debt

### API Key Expiration Status
**Issue**: API keys do not automatically transition from `active` to `expired` status when their expiration date passes.

**Impact**: Expired API keys may still appear as "active" in the UI and can be used to authenticate heartbeats until manually revoked.

**Workaround**: Manually revoke expired keys from the API Keys settings page.

**Solution (Iteration 2)**: Implement one of the following:
- **Option A**: Add a scheduled background job (cron) to mark expired keys as `expired` status
- **Option B**: Validate API key expiration at auth time in the heartbeat validation middleware
- **Option C**: Combine both approaches for comprehensive coverage

**Affected Endpoints**:
- `POST /api/heartbeat` - Accepts expired keys
- `GET /api/api-keys` - Shows expired keys as "active"

### Related Tasks
- [ ] Add expiration validation middleware for API key authentication
- [ ] Implement background job for periodic status updates
- [ ] Add visual warnings in UI for soon-to-expire keys
- [ ] Add audit logging for key usage and expiration events

## 📄 License

This project is licensed under the [Server Side Public License (SSPL)](LICENSE).

The SSPL is designed to ensure that if you offer the functionality of this software as a service to third parties, you must make the service's source code available under this license. This protects against large cloud providers offering the software as a service without contributing back to the open source community.

For more details, see the [SSPL FAQ](https://www.mongodb.com/licensing/server-side-public-license/faq).

## 🙋 Support

- 📧 Email: support@synmet.dev
- 💬 GitHub Issues for bug reports

---

**Made with ❤️ by @marprezd and the Synmet community**

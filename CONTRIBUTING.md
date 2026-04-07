# Contributing to Synmet

Thank you for your interest in contributing to Synmet! We welcome contributions from the community to help improve this open-source development activity tracking platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [License](#license)

## 🤝 Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 14+ (local or remote)
- Git

### Quick Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/synmet.git
cd synmet

# Install dependencies
pnpm install

# Set up environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your configuration

# Set up the database
pnpm generate
pnpm migrate

# Start development server
pnpm dev
```

## 🛠️ Development Setup

### Environment Configuration

Create a `.dev.vars` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/synmet_dev"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"

# Redis (for rate limiting)
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

### Database Setup

```bash
# Generate Prisma client
pnpm generate

# Run migrations
pnpm migrate

# (Optional) Seed with test data
pnpm prisma db seed
```

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


## 📝 Contributing Guidelines

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

### Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint`
6. Commit your changes
7. Push to your fork
8. Create a Pull Request

### Testing

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Run linting
pnpm lint
```

## 🔄 Submitting Changes

### For New Features

1. Discuss the feature in an issue first
2. Create a feature branch
3. Implement the feature with tests
4. Update documentation if needed
5. Submit a pull request

### For Bug Fixes

1. Create an issue describing the bug
2. Create a fix branch
3. Write a test that reproduces the bug
4. Fix the bug
5. Ensure all tests pass
6. Submit a pull request

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Node.js version, browser
- **Screenshots**: If applicable

### Feature Requests

For feature requests, please include:

- **Description**: What feature you'd like to see
- **Use case**: Why this feature would be useful
- **Alternatives**: Any alternative solutions you've considered

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new functions
- Update API documentation for endpoint changes
- Add migration guides for breaking changes

## 🔒 Security

- Never commit sensitive information
- Use environment variables for secrets
- Follow security best practices
- Report security vulnerabilities privately

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the [Server Side Public License (SSPL)](LICENSE).

The SSPL ensures that if the software is offered as a service, the source code must remain available under the same license terms.

## 🙋 Questions?

If you have questions about contributing:

- Check existing issues and documentation
- Join our community discussions
- Contact the maintainers

Thank you for contributing to Synmet! 🎉
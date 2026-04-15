# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-04-14

### Added
- Support for NextAuth v5 with improved edge runtime compatibility
- Custom Domain setup in Cloudflare Workers
- Invocation logs for debugging in Cloudflare
- Sign out functionality in the user interface

### Changed
- Migrated from Prisma adapter to JWT-only strategy for edge runtime compatibility
- Optimized authentication for Cloudflare Workers environment
- Updated @opennextjs/cloudflare from 1.17.1 to 1.18.1

### Fixed
- 500 Internal Server Error on `/api/auth/session` endpoint with `trustHost: true`
- 500 Internal Server Error on protected pages in preview mode
- Race condition causing flash of protected content before authentication check
- R2 binding NEXT_INC_CACHE_R2_BUCKET configuration

### Removed
- Traces field from wrangler.json observability section

## [0.1.0] - 2026-04-06

### Added
- Initial Next.js project structure with i18n support
- Authentication setup with NextAuth v4
- Cloudflare Workers integration via OpenNext
- PostgreSQL database with Prisma ORM
- UI components with shadcn/ui
- Multi-language support (English, Spanish, Portuguese)
- Responsive design with Tailwind CSS
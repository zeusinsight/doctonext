# IndieSaas Starter

[![Demo](https://img.shields.io/badge/Live%20Demo-View%20Here-blue?style=for-the-badge)](https://nextjs.better-auth-starter.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.2.9-orange?style=for-the-badge)](https://better-auth.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

A modern, production-ready Next.js starter template with comprehensive authentication built on Better Auth, featuring a beautiful UI with shadcn/ui components and a robust tech stack.

## Tech Stack
- **Better Auth** - Modern, type-safe authentication library
- **Better Auth UI** - Pre-built authentication components
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion** - Smooth animations and transitions
- **Biome** - Fast linter and formatter
- **Turborepo** - Monorepo build system
- **PostgreSQL** - Robust, production-ready database
- **Drizzle ORM** - Type-safe database queries


## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (neon.tech)
- pnpm (recommended) or npm/yarn

### 1. Clone the Repository
```bash
git clone https://github.com/indieceo/Indiesaas
cd indiesaas-starter
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```bash
# Required: Generate at https://www.better-auth.com/docs/installation#set-environment-variables
BETTER_AUTH_SECRET="your-secret-key-here"

# Required: PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/your-database"

# Optional: OAuth providers (configure as needed)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""
```

### 4. Database Setup
Generate the authentication schema and run migrations:

```bash
# Generate Better Auth schema
npx @better-auth/cli generate

# Generate Drizzle migrations
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate
```

### 5. Start Development Server
```bash
npm run dev
# or
pnpm dev
```

## 🔧 Configuration

### Better Auth Configuration
The authentication is configured in `src/lib/auth.ts`. You can customize:
- OAuth providers (Google, GitHub, etc.)
- Email templates
- Session settings
- Password policies

### Database Configuration
Database connection and schema are managed through:
- `drizzle.config.ts` - Drizzle ORM configuration
- `auth-schema.ts` - Better Auth schema definition
- `src/database/` - Database utilities and queries

### UI Customization
The UI is built with shadcn/ui components and can be customized:
- Theme colors in `src/styles/globals.css`
- Component variants in individual component files
- Global styles in `src/styles/`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
This starter works with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Better Auth Ui](https://better-auth-ui.com) - ready authentication component
- [shadcn landing page](https://github.com/nobruf/shadcn-landing-page) - landing page used for this boilerplate


## ☕️ Support the Project

If this starter helps you build something amazing, consider supporting the development:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/daveycodez)

---

**Made with ❤️ by [@indieceo](https://x.com/indieceo)**

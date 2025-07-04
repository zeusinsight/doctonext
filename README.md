# IndieSaas Starter

A modern, production-ready Next.js starter template with comprehensive authentication built on Better Auth, featuring a beautiful UI with shadcn/ui components and a robust tech stack.

## Tech Stack

- **Better Auth UI** - Pre-built authentication components
- **shadcn/ui** - Beautiful, accessible component library
- **Framer Motion** - Smooth animations and transitions
- **Biome** - Fast linter and formatter
- **Turborepo** - Monorepo build system
- **PostgreSQL** - Robust, production-ready database
- **Drizzle ORM** - Type-safe database queries


##  Quick start

### 1. Clone the Repository
```bash
git clone https://github.com/indieceo/Indiesaas
cd indiesaas
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

##  Configuration

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
- Custom styles in `src/styles/custom.css`
- Component variants in individual component files


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- [Better Auth Ui](https://better-auth-ui.com) - ready authentication component
- [shadcn landing page](https://github.com/nobruf/shadcn-landing-page) - landing page used for this boilerplate



---

<div align="center" >
  <p><strong>Sponsored by Posthyve</strong></p>
  <a href="https://posthyve.com" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
    <img src="https://posthyve.com/logo.svg" alt="Posthyve" width="32" height="32">
  </a>
  <p><em>All-in-One Social Media Management Platform</em></p>
</div>

<div align="center">

  **Made with ❤️ by [@indieceo](https://x.com/indieceo)**

</div>

<div align="center">
  <img src="public/logo.svg" alt="IndieSaas Starter Logo" width="80" height="80">
  <h1>
    <picture>
      <img src="https://readme-typing-svg.demolab.com?font=Poppins&weight=600&size=42&duration=1&pause=1000&color=D14424&center=true&vCenter=true&width=435&lines=IndieSaas+Starter" alt="IndieSaas Starter" />
    </picture>
  </h1>
</div>


A modern, production-ready Next.js starter template with comprehensive authentication built on Better Auth, featuring a beautiful UI with shadcn/ui components and a robust tech stack.

## Tech Stack

- **Better Auth UI** - Pre-built authentication components
- **shadcn/ui** - Beautiful, accessible component library
- **Biome** - Fast linter and formatter
- **Turborepo** - Monorepo build system
- **PostgreSQL** - Robust, production-ready database
- **Drizzle ORM** - Type-safe database queries
- **UploadThing** - Modern file uploads with built-in storage


## 🗺️ Roadmap

- [x] Authentication with Better Auth
  - Email/Password
  - OAuth (Google, GitHub)
  - User management
- [x] Dashboard
  - Modern UI with shadcn/ui
  - Responsive design
  - Dark/Light mode
  - Setting page

- [ ] Stripe/Polar.sh Payment
- [ ] SEO Optimization
- [ ] Blog System



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

# Required: PostgreSQL connection 
DATABASE_URL="postgresql://username:password@localhost:5432/your-database"

# Required for avatars upload: UploadThing API keys (get from https://uploadthing.com/dashboard)
UPLOADTHING_TOKEN="" 

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


## Usage

Feel free to use and customize this template as per your requirements. You can modify the components, styles, and content to create your unique website.

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it as you wish.

## 🙏 Credits

This project was inspired by nobruf [shadcn landing page](https://github.com/nobruf/shadcn-landing-page), and daveyplate [Better Auth Next.js starter](https://github.com/daveyplate/better-auth-nextjs-starter).

- [Better Auth Ui](https://better-auth-ui.com) - Pre-built authentication components
- [shadcn landing page](https://github.com/nobruf/shadcn-landing-page) - landing page used for this project



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

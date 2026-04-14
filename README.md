# Unified Supplier Collaboration Platform (USP)

A complete, supplier-first procurement network where suppliers manage all buyers in one place, and buyers collaborate, transact, and scale supplier relationships efficiently.

## 🎯 Vision
Build a **supplier-centric, flexible, collaborative procurement layer** that eliminates multi-portal friction and standardizes B2B transactions.

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/) (React), TailwindCSS, Lucide Icons.
- **Backend**: [Node.js](https://nodejs.org/) (Express), TypeScript, Prisma-style modularity.
- **Database/Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS).
- **Monorepo**: Managed with `npm workspaces`.

### Project Structure
```plaintext
├── frontend/             # Next.js Application (Port 3000)
├── backend/              # Node.js Express API (Port 3001)
├── database/             # Supabase Schema & Migrations
└── package.json          # Root Monorepo Configuration
```

## 🚀 Key Features

- **Multi-Tenant Design**: Strong isolation between Buyer and Supplier organizations.
- **Connection Management**: Invitational system to link buyers and suppliers.
- **Purchase Order Workflow**: Standardized PO creation, acceptance, and tracking.
- **Invoice Flip Logic**: One-click conversion from Accepted PO to formal Invoice.
- **Premium UI**: Modern, data-driven dashboard with real-time stats.

## 🛠️ Getting Started

### 1. Database Setup
1. Create a project on [Supabase](https://supabase.com).
2. Execute the SQL schema found in `./database/migrations/01_initial_schema.sql` in the Supabase SQL Editor.

### 2. Environment Variables
Copy `.env.example` (if present) or create the following:

**Backend (`/backend/.env`):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3001
```

**Frontend (`/frontend/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Installation
```bash
# Install core dependencies for all workspaces
npm install
```

### 4. Running Locally
```bash
# Launch both Frontend & Backend in parallel
npm run dev
```

## 📊 Roadmap
- [ ] Phase 2: Catalog Management & Product Pricing.
- [ ] Phase 3: AI-powered Invoice OCR & Recommendations.
- [ ] Phase 4: Integration with Tally/ERP systems.

## 📄 License
MIT

---
*Built with ❤️ for better B2B collaboration.*

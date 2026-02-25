# Houspire V2 - Quick Start Guide

## Development with Lovable

This project is built with Lovable and uses Lovable Cloud for backend services.

### Getting Started

1. **Open in Lovable**: Visit your Lovable project URL
2. **Backend is Ready**: Lovable Cloud provides Supabase automatically
3. **Make Changes**: Edit via chat or code view
4. **Preview**: See changes instantly in the preview pane

### Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── dashboard/      # User dashboard (timer, phases)
│   ├── discover/       # Gallery components
│   ├── home/           # Landing page sections
│   ├── intake/         # Multi-step form
│   ├── layout/         # Header, Footer, Container
│   ├── pricing/        # Pricing cards & modals
│   └── ui/             # shadcn/ui components
├── contexts/           # Auth context
├── hooks/              # Custom hooks (timer, project status)
├── lib/                # Utilities (analytics, notifications)
├── pages/              # Route pages
├── stores/             # Zustand stores
└── integrations/       # Supabase client & types
```

### Key Features

| Feature | Location |
|---------|----------|
| Authentication | `src/contexts/AuthContext.tsx` |
| Timer System | `src/hooks/useTimer.ts` |
| Project Status | `src/hooks/useProjectStatus.ts` |
| Intake Form | `src/pages/Intake.tsx` |
| Gallery | `src/pages/Discover.tsx` |
| Dashboard | `src/pages/Dashboard.tsx` |
| Notifications | `supabase/functions/send-notification/` |

### Adding Secrets

To add API keys (Resend, Twilio, etc.):
1. Ask Lovable to add the secret
2. Enter the value in the secure form
3. Secret is available in edge functions

### Database Tables

All tables are managed via migrations in `supabase/migrations/`:
- `profiles` - User profiles
- `projects` - Design projects
- `project_inputs` - Intake form data
- `gallery_designs` - Design gallery
- `notifications` - Notification logs
- `support_tickets` - Support requests

### Testing Checklist

Before publishing:
- [ ] Test user signup/login
- [ ] Test intake form submission
- [ ] Test gallery browsing & filtering
- [ ] Test dashboard timer display
- [ ] Check mobile responsiveness
- [ ] Verify all pages load correctly

### Publishing

1. Click **Share** in Lovable header
2. Click **Publish**
3. Your app is live!

### Custom Domain

1. Go to **Settings** → **Domains**
2. Click **Connect Domain**
3. Follow DNS setup instructions

### Need Help?

- Lovable Docs: https://docs.lovable.dev
- Support: Reply in chat

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│  Pages: Index, Discover, Dashboard, Intake, Checkout, Admin │
│  State: Zustand (auth, cart, intake, project)               │
│  UI: shadcn/ui + Tailwind CSS + Framer Motion               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Lovable Cloud (Supabase)                   │
├─────────────────────────────────────────────────────────────┤
│  Auth: Email/password authentication                         │
│  Database: PostgreSQL with RLS                              │
│  Storage: File uploads (photos, floor plans)                │
│  Edge Functions: Notifications (email/WhatsApp)             │
│  Real-time: Project status updates                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────────────────────────────────────────────────┤
│  Payments: Razorpay (India) / Stripe (International)        │
│  Email: Resend                                               │
│  WhatsApp: Twilio                                            │
└─────────────────────────────────────────────────────────────┘
```

## User Journey

```
1. Landing Page
   └─> Style Quiz (8 steps)
       └─> Designer Match Results
           └─> Checkout (₹499)
               └─> Payment Success
                   └─> Intake Form (5 steps)
                       └─> Dashboard (72hr timer)
                           └─> Concepts Ready
                               └─> Review & Feedback
                                   └─> Final Delivery
```

## Admin Flow

```
1. Admin Login
   └─> Admin Dashboard
       ├─> Projects Tab (manage all projects)
       ├─> Workflow Tab (phase management)
       ├─> CRM Tab (customer data)
       └─> Analytics Tab (metrics)
```

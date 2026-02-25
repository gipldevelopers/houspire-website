# Houspire V2 - Production Deployment Guide

## Overview

This guide covers deploying Houspire V2 using Lovable Cloud, which provides an integrated Supabase backend without requiring a separate Supabase account.

---

## Pre-Deployment Checklist

### 1. Environment Setup ✅

Lovable Cloud is already enabled and configured. The following are auto-configured:
- `VITE_SUPABASE_URL` - Auto-generated
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Auto-generated
- `VITE_SUPABASE_PROJECT_ID` - gatfchegbyiafudspigp

**Secrets to Add via Lovable Cloud:**

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `RESEND_API_KEY` | Email sending via Resend | Yes |
| `RAZORPAY_KEY_ID` | Razorpay payment (India) | Yes |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe (International) | Optional |
| `TWILIO_ACCOUNT_SID` | WhatsApp notifications | Optional |
| `TWILIO_AUTH_TOKEN` | Twilio auth | Optional |
| `TWILIO_WHATSAPP_NUMBER` | WhatsApp sender | Optional |

### 2. Database Setup (Automatic) ✅

All database tables are created via migrations:
- ✅ profiles
- ✅ projects
- ✅ project_inputs
- ✅ concepts
- ✅ concept_products
- ✅ gallery_designs
- ✅ notifications
- ✅ support_tickets
- ✅ referral_codes
- ✅ referral_usage
- ✅ user_credits
- ✅ quiz_results
- ✅ receipts
- ✅ progress_photos
- ✅ newsletter_subscribers

**Row Level Security (RLS):**
- ✅ All tables have RLS enabled
- ✅ User-specific data protected
- ✅ Admin policies where needed

**Storage Buckets:**
- `project-uploads` - Room photos, floor plans

### 3. Authentication Setup ✅

Configure via Lovable Cloud:
```
Auto-confirm email: Enabled (recommended for development)
Disable signup: No
Anonymous users: Disabled
```

**Admin User Setup:**
1. Sign up with admin email
2. Update profile role to 'admin' via database

### 4. Payment Gateway Setup

#### Razorpay (India)
1. Create account at https://razorpay.com
2. Complete KYC verification
3. Get API Key ID and Secret from Dashboard → API Keys
4. Add secrets to Lovable Cloud:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. Configure webhook (optional):
   - URL: `{SUPABASE_URL}/functions/v1/razorpay-webhook`
   - Events: `payment.captured`, `payment.failed`

#### Stripe (International - Optional)
1. Create account at https://stripe.com
2. Get keys from Developers → API keys
3. Add `STRIPE_SECRET_KEY` to Lovable Cloud
4. Update `.env` with `VITE_STRIPE_PUBLISHABLE_KEY`

### 5. Email Setup

#### Resend (Recommended)
1. Create account at https://resend.com
2. Verify domain (houspire.ai)
3. Get API key from API Keys section
4. Add `RESEND_API_KEY` to Lovable Cloud

The `send-notification` edge function handles:
- Welcome emails
- Concept ready notifications
- Delivery complete notifications
- Support ticket updates

### 6. WhatsApp Setup (Optional)

#### Twilio
1. Create account at https://twilio.com
2. Get WhatsApp Business API access
3. Add secrets:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`

---

## Deployment Steps

### Step 1: Publish via Lovable

1. Click **"Share"** button in Lovable
2. Click **"Publish"**
3. Wait for deployment to complete
4. Note the published URL

### Step 2: Verify Deployment

**Smoke Test Checklist:**
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Style quiz completes
- [ ] Login/Signup works
- [ ] Gallery displays designs
- [ ] FAQ page loads
- [ ] Mobile responsive
- [ ] Images load

**Integration Test Checklist:**
- [ ] Can create account
- [ ] Can complete quiz
- [ ] Quiz results saved
- [ ] Can view dashboard
- [ ] Referral code generation works
- [ ] Newsletter signup works
- [ ] Settings page functional

### Step 3: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add custom domain (e.g., houspire.ai)
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: [provided by Lovable]
   ```
4. Wait for SSL certificate (automatic)

---

## Post-Deployment

### Content Seeding

**Gallery Designs:**
```sql
INSERT INTO gallery_designs (
  design_title,
  room_type,
  style_primary,
  budget_range,
  cover_image_url,
  is_published
) VALUES (
  'Modern Minimalist Bedroom',
  'bedroom',
  'modern_minimalist',
  '₹50K - ₹1L',
  'https://example.com/image.jpg',
  true
);
```

**Designer Personas:**
Already configured in `src/lib/constants.ts`

### Monitoring

**Error Tracking (Optional):**
- Add Sentry DSN to track errors
- Configure in `src/lib/errorTracking.ts`

**Analytics (Optional):**
- Add PostHog key for user analytics
- Configure in `src/lib/analytics.ts`

---

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3.5s |
| Lighthouse Score | > 90 |
| Page Load Time | < 2s |

---

## Security Checklist

- [x] RLS policies on all tables
- [x] Input validation on forms
- [x] File upload restrictions
- [x] HTTPS enforced (automatic)
- [x] API keys stored as secrets
- [x] No sensitive data in client code
- [x] Session management via Supabase Auth

---

## SEO Checklist

- [x] SEOHead component on all pages
- [x] Meta descriptions set
- [x] Open Graph tags configured
- [x] Alt text on images
- [x] Semantic HTML structure
- [x] robots.txt present

---

## Troubleshooting

### Common Issues

**1. Auth not working**
- Check auto-confirm email setting
- Verify Supabase URL in environment

**2. Database errors**
- Check RLS policies
- Verify user is authenticated
- Check foreign key constraints

**3. Payments failing**
- Verify API keys are correct
- Check webhook configuration
- Test with sandbox/test mode first

**4. Emails not sending**
- Verify RESEND_API_KEY
- Check domain verification
- Review edge function logs

**5. Images not loading**
- Check storage bucket permissions
- Verify file upload size limits
- Check CORS configuration

### Viewing Logs

1. Open Lovable Cloud panel
2. Navigate to Edge Functions
3. View logs for specific functions

---

## Success Metrics (First 30 Days)

| Metric | Target |
|--------|--------|
| Signups | 100+ |
| Completed Payments | 50+ |
| Delivered Projects | 30+ |
| Refund Rate | < 5% |
| Uptime | > 99% |
| Critical Bugs | 0 |

---

## Support Resources

- **Lovable Docs:** https://docs.lovable.dev
- **Supabase Docs:** https://supabase.com/docs
- **Razorpay Docs:** https://razorpay.com/docs
- **Resend Docs:** https://resend.com/docs

---

## Quick Reference

### Key Files
- `src/App.tsx` - Routes and providers
- `src/contexts/AuthContext.tsx` - Authentication
- `src/lib/pricing.ts` - Pricing configuration
- `src/lib/constants.ts` - App constants
- `supabase/functions/send-notification/` - Email function

### Environment Variables (Client-Side)
```
VITE_SUPABASE_URL=auto
VITE_SUPABASE_PUBLISHABLE_KEY=auto
VITE_SUPABASE_PROJECT_ID=gatfchegbyiafudspigp
VITE_RAZORPAY_KEY_ID=your_key
VITE_STRIPE_PUBLISHABLE_KEY=your_key
```

### Secrets (Server-Side via Lovable Cloud)
```
RESEND_API_KEY=re_xxx
RAZORPAY_KEY_SECRET=xxx
STRIPE_SECRET_KEY=sk_xxx
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=+1xxx
```

---

## Ready to Launch! 🚀

1. ✅ All features implemented
2. ✅ Database configured with RLS
3. ✅ Authentication enabled
4. ⏳ Add payment secrets
5. ⏳ Add email secrets
6. ⏳ Seed gallery content
7. ⏳ Publish via Lovable
8. ⏳ Configure custom domain
9. ⏳ Test end-to-end
10. ⏳ Launch!

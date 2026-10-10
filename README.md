# Ardio Career Hub

Phase 1: CV website. Portfolio manager: photos and videos managed from `admin.html`, stored in Supabase.

## Jobs
`jobs.js` loads live marketing jobs from Remotive's free public API (no key), keeps those open to Indonesia or worldwide, and ranks them by keyword match. Results are cached in the visitor's browser for 6 hours. Remotive requires a link back to each listing and attribution (both included); do not copy its listings to other sites.

## Files
- `index.html` public site | `admin.html` private admin | `portfolio.js` public gallery
- `config.js` your Supabase URL and anon key | `supabase-setup.sql` one-time database setup
- `Ardio-Hakim-Putranto-CV.pdf` add yourself

## Supabase setup (free plan, no card needed at signup)
1. supabase.com > sign in with GitHub > New project. Save the database password somewhere safe.
2. SQL Editor > New query > paste `supabase-setup.sql` > Run.
3. Authentication > Users > Add user > create user with your email and a strong password (tick auto-confirm).
4. Authentication > Sign In / Providers > turn OFF "Allow new users to sign up".
5. Project Settings > API: copy the Project URL and the anon / publishable key into `config.js`. Never use the service_role / secret key.
6. In GitHub, edit `config.js` and commit. Visit `/admin.html` on your site and sign in.

## Limits and costs (verify at supabase.com/pricing)
Free plan: roughly 1 GB storage, 50 MB per file, limited monthly bandwidth; projects can pause after about a week of inactivity (the site then shows the basic portfolio cards until you restore the project). Pro plan is paid monthly.
Photos are resized in your browser before upload (max 2000 px, WebP). Use YouTube (unlisted) for large videos.

## Safety
- Public visitors can only read items marked Public. Files stay in a private bucket and are served with temporary links.
- The anon key is meant to be public. Row-level security in the SQL file is what protects your data.
- Get permission before publishing confidential client work or former-employer material.

## Application tracker
Run `supabase-tracker.sql` once in Supabase (SQL Editor). Open `/tracker.html` on your site and sign in with the same admin login. Statuses: Saved, Ready to Apply, Applied, Interview, Assessment, Offer, Rejected, Follow-up Needed. Apply opens the official page; nothing is submitted or emailed automatically. Prepare creates an editable cover letter or client pitch template from your verified facts.

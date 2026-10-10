-- Run once in Supabase: SQL Editor > New query > paste > Run (after supabase-setup.sql)
create table applications(
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'job' check (kind in ('job','client')),
  company text not null, role text not null, url text,
  status text not null default 'Saved' check (status in ('Saved','Ready to Apply','Applied','Interview','Assessment','Offer','Rejected','Follow-up Needed')),
  applied_date date, deadline date, notes text, next_action text,
  created_at timestamptz default now());
alter table applications enable row level security;
create policy "owner all" on applications for all to authenticated using (is_owner()) with check (is_owner());

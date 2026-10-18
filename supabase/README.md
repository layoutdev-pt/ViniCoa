# Supabase setup

The initial migration creates the catalog, featured products, profiles, contact messages, reviews, and orders. Public roles can read active catalog content and published reviews. Public direct writes are disabled; form submissions and checkout must go through a server-side handler that validates input and applies bot/rate-limit checks.

## Apply to the production project

1. Install or run the Supabase CLI and authenticate: `npx supabase login`.
2. Link this checkout to the intended Supabase project: `npx supabase link --project-ref <project-ref>`.
3. Review the pending SQL first: `npx supabase db push --dry-run`.
4. Apply migrations: `npx supabase db push`.

There is no `supabase deploy` command for database migrations. `db push` applies the versioned SQL migrations. Deploying the website is a separate step on its hosting platform.

## Create the first administrator

Create the initial user through Supabase Auth, then run this once in the Supabase SQL Editor, replacing the email with that account's address:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@example.pt');
```

The auth trigger creates new profiles as `customer`; a user's submitted metadata cannot assign the admin role.

## Required before public launch

- Add the Supabase project URL and publishable key to the hosting environment. Keep any secret/service-role key server-side only.
- Implement server-side form actions. Contact and review data must not be inserted directly from the browser.
- Verify a CAPTCHA such as Cloudflare Turnstile on the server and enforce request rate limits before accepting public submissions. The existing browser honeypots are only an extra signal, not bot protection on their own.
- Finish the payment provider flow and confirm paid orders server-side before creating the Vendus invoice/document.
- Configure the real site URL and allowed Auth redirect URLs in Supabase before enabling production authentication.

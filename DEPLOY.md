Why saving fails on Netlify
-------------------------

Netlify Functions are serverless and run in ephemeral containers. Any writes to disk (for example, saving uploaded files to `data/uploads` or writing JSON files) won't persist across function invocations or deploys. That's why "Failed to save pickup" or "Failed to save product" can occur: the production deployment either doesn't have the backend endpoints running or attempts to write to disk that isn't persistent.

Recommended fixes
------------------

1. Host the backend on a platform that supports a persistent filesystem or external storage. Good options:
   - Render (web service) — supports Dockerfile and Node apps, persistent disk during runtime.
   - Railway / Fly.io — easy Node deployments and persistent storage options.
   - Heroku (dyno filesystem is ephemeral but suitable for short-lived; prefer object storage).

2. Or modify the app to use external storage instead of local disk:
   - Store uploaded files in S3-compatible storage (AWS S3, DigitalOcean Spaces) and store metadata in a database (Postgres, SQLite, etc.).
   - Use a managed database (Supabase, PlanetScale) for pickups and reports.

Quick start (Render using Dockerfile):

1. Create an account at https://render.com
2. Create a new Web Service, connect your GitHub repo, and choose the `Dockerfile` deploy option.
3. Set environment variables in Render (if any) and deploy. The app will be available on a stable URL and file writes will persist while the instance is running.

Alternatively, if you want to keep using Netlify for static frontend hosting, deploy the Express backend separately and set `VITE_API_BASE_URL` to the backend URL (in Netlify environment variables) so the frontend talks to the persistent backend.

# GitHub Monorepo + Vercel Plan

## Structure

- `strona-demo` - reusable accounting office website system
- `Strona-trenerzy` - CRM workspace and trainer project
- workspace root - scripts, shared notes, and deployment helpers

## Recommended GitHub setup

1. Create one GitHub repository for the whole workspace.
2. Push this full folder as a monorepo.
3. Keep `main` as the deployment branch.

## Recommended Vercel setup

### CRM

- Project root: `Strona-trenerzy`
- Build command: `npm run build`
- Output directory: `dist`
- Expected local port: `5173`

### Accounting pages

- Project root: `strona-demo`
- Build command: `npm run build`
- Output directory: `dist`
- One Vercel project per accounting office slug

Required environment variables per accounting office project:

- `VITE_CLIENT_SLUG=<biuro-slug>`
- `VITE_SITE_MODE=prod`
- `VITE_SITE_URL=https://your-final-domain.example`

## Why monorepo

- CRM and ready-page data stay in one source of truth.
- Bulk content fixes remain easy.
- One GitHub repo can feed many Vercel projects.
- It matches the existing trainer deployment pattern already used in `Strona-trenerzy`.

## Next step after GitHub push

1. Create the GitHub repo.
2. Add the remote locally.
3. Push `main`.
4. Connect Vercel to:
   - `Strona-trenerzy` for CRM
   - `strona-demo` for accounting-office projects
5. Start with one test slug before mass deployment.

## Automation path for many accounting pages

Recommended future additions:

- `strona-demo/biura_deploy_queue.csv`
- `strona-demo/scripts/deploy_all_biura_from_repo.py`
- `.github/workflows/deploy-all-biura.yml`

This would mirror the trainer workflow already present in:

- `Strona-trenerzy/scripts/deploy_all_projects_from_repo.py`
- `Strona-trenerzy/.github/workflows/deploy-all-vercel.yml`

## Manual GitHub creation checklist

After creating the repository manually on GitHub, run these commands from the workspace root:

```bash
git add .
git commit -m "prepare accounting monorepo for GitHub and Vercel"
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

Example remote URL formats:

- `https://github.com/<user>/<repo>.git`
- `git@github.com:<user>/<repo>.git`

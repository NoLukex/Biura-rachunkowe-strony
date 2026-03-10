# Folder map (quick orientation)

## Core app
- `App.tsx`, `index.tsx`, `index.html` - main trainer website app
- `components/` - website sections and UI blocks
- `crm/CrmApp.tsx` - local CRM dashboard at `/crm`
- `data/` - app data and generated profiles

## CRM/operations data
- `clients_deploy_queue.csv` - master queue (deployed + excluded statuses)
- `outreach/` - outreach lists, review exports, email splits
- `reports/` - enrichment and operational reports
- `data/deploy_reports/` - archived deployment wave results and audits

## Automation scripts
- `scripts/` - generation, deploy, enrichment scripts

## Infra/docs
- `vercel.json` - rewrite rules
- `VERCEL_DEPLOY.md` - Vercel deployment notes
- `README.md` - run + CRM usage

## Generated/runtime
- `logs/dev.log` - local dev server log
- `dist/` - build output
- `node_modules/` - dependencies

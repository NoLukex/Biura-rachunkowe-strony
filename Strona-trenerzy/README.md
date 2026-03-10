<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run the trainer website locally

This repository contains one reusable website template for many personal trainers.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Generate all trainer profiles from CSV:
   `python scripts/generate_client_profiles.py`
3. Run the app:
   `npm run dev`

## Local CRM Workspace

- Open `http://localhost:5173/crm` to use the local lead management app.
- The CRM is project-based (first default project: `Trenerzy personalni - Bydgoszcz`).
- It includes lead table, filters, lead detail editor, notes, activity history, and a `Mailing` tab with ready outreach sequences.
- `Mailing` includes research-driven personalization fields (`niche`, `confidence`, `quick win`) and tone variants (`friendly`, `premium`, `direct`).
- It supports CSV import (`merge` or `replace`) with import logs.
- It can export project data (`Export all`) and outreach-ready list (`Export send_now`).
- It can export the personalized outreach playbook (`Export playbook`).
- Data is stored locally in browser localStorage.
- Seed data loads from real workspace CSVs (`clients_deploy_queue.csv`, `outreach/deployed_contacts.csv`, wave deploy reports), so CRM starts with full project scope and working Vercel URLs where available.

### Outreach playbook generation

- Regenerate personalized outreach messages from current lead data:
  - `python scripts/generate_outreach_playbook.py`
- Output file used by CRM:
  - `outreach/personalized_outreach_playbook.csv`
- The generator builds demo-first messaging with 3 follow-ups and per-lead personalization based on website/social cues.

### Email trainer website personalization

- Regenerate full research + copy pack for trainers that already have email:
  - `python scripts/generate_email_trainer_personalization.py`
- Regenerate local review checklist with direct preview links:
  - `python scripts/generate_local_review_checklist.py`
- Outputs:
  - `data/emailTrainerPersonalization.ts` (runtime copy overrides per trainer)
  - `reports/email_trainers_research_<date>.md` (research notes)
  - `reports/email_trainers_copy_pack_<date>.csv` (structured export)
  - `reports/email_trainers_local_review_<date>.md` (local QA links)

### Data layout

- Deployment wave files and audits are now in `data/deploy_reports/`.
- Use `FOLDER_MAP.md` for a quick file/folder orientation.

## UI/UX Skill workflow

- UI was redesigned using the local `ui-ux-pro-max` skill dataset.
- To regenerate design recommendations run from workspace root:
  - `python ".opencode/skills/ui-ux-pro-max/scripts/search.py" "operations dashboard enterprise blue teal" --design-system -f markdown`

## Notes

- Forms are ready for production flow, but in draft mode they store submissions locally.
- To send leads to your backend later, set `VITE_LEAD_WEBHOOK_URL` in `.env.local`.
- You can preview a specific trainer with `?trainer=<slug>` or `/t/<slug>`.
- For Vercel per-client deployment set `VITE_CLIENT_SLUG=<slug>` in project env vars.

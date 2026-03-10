import React from 'react';
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  CircleDashed,
  Copy,
  ExternalLink,
  FileDown,
  FileUp,
  FolderKanban,
  Mail,
  Plus,
  Search,
  Send,
  Timer,
  UserCircle2,
} from 'lucide-react';
import queueCsvRaw from '../clients_deploy_queue.csv?raw';
import deployedContactsCsvRaw from '../outreach/deployed_contacts.csv?raw';
import wave1CsvRaw from '../data/deploy_reports/wave1_deploy_results.csv?raw';
import wave2CsvRaw from '../data/deploy_reports/wave2_deploy_results.csv?raw';
import wave2ReplacementCsvRaw from '../data/deploy_reports/wave2-replacement_deploy_results.csv?raw';
import wave2Replacement2CsvRaw from '../data/deploy_reports/wave2-replacement2_deploy_results.csv?raw';
import wave3CsvRaw from '../data/deploy_reports/wave3_deploy_results.csv?raw';
import wave4CsvRaw from '../data/deploy_reports/wave4_deploy_results.csv?raw';
import wave4ReplacementCsvRaw from '../data/deploy_reports/wave4-replacement_deploy_results.csv?raw';
import wave4Replacement2CsvRaw from '../data/deploy_reports/wave4-replacement2_deploy_results.csv?raw';
import redeployResultsCsvRaw from '../reports/redeploy_meta_refresh_results.csv?raw';
import outreachPlaybookCsvRaw from '../outreach/personalized_outreach_playbook.csv?raw';
import torunLeadsCsvRaw from '../data/torun_trenerzy_personalny_2024.csv?raw';
import poznanLeadsCsvRaw from '../data/poznan_trenerzy_personalny_2026.csv?raw';
import gdanskLeadsCsvRaw from '../data/gdansk_trenerzy_personalni_2026.csv?raw';
import poznanAccountingLeadsCsvRaw from '../data/poznan_biura_rachunkowe_2026.csv?raw';
import poznanAccountingReadyPagesCsvRaw from '../data/poznan_biura_ready_pages_2026.csv?raw';

type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type Lead = {
  id: string;
  projectId: string;
  deploymentStatus: string;
  slug: string;
  title: string;
  email: string;
  emailStatus: 'verified' | 'risky' | 'not_found';
  workflowStatus: 'new' | 'review' | 'ready_to_send' | 'sent' | 'follow_up' | 'closed';
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  vercelProject: string;
  vercelUrl: string;
  priority: 'low' | 'medium' | 'high';
  owner: string;
  tags: string[];
  nextActionDate: string;
  updatedAt: string;
};

type LeadNote = {
  id: string;
  leadId: string;
  text: string;
  pinned: boolean;
  createdAt: string;
};

type LeadActivity = {
  id: string;
  leadId: string;
  action: string;
  details: string;
  createdAt: string;
};

type ImportRun = {
  id: string;
  projectId: string;
  fileName: string;
  mode: 'merge' | 'replace';
  added: number;
  updated: number;
  skipped: number;
  createdAt: string;
};

type CrmState = {
  projects: Project[];
  leads: Lead[];
  notes: LeadNote[];
  activity: LeadActivity[];
  imports: ImportRun[];
};

type OutreachPlan = {
  slug: string;
  first_name: string;
  source_type: string;
  confidence: string;
  niche: string;
  opener_line: string;
  quick_win: string;
  tone_recommendation: string;
  subject_1: string;
  subject_alt_1: string;
  email_1: string;
  email_1_friendly: string;
  email_1_premium: string;
  email_1_direct: string;
  followup_1: string;
  followup_2: string;
  followup_3: string;
  dm_1: string;
  dm_followup: string;
  phone_opening: string;
  research_notes: string;
  cta: string;
  playbook_version: string;
};

const STORAGE_KEY = 'trainer_crm_state_v4';
const BYDGOSZCZ_PROJECT_ID = 'project-trenerzy-personalni-bydgoszcz';
const TORUN_PROJECT_ID = 'project-trenerzy-personalni-torun';
const POZNAN_PROJECT_ID = 'project-trenerzy-personalni-poznan';
const GDANSK_PROJECT_ID = 'project-trenerzy-personalni-gdansk';
const ACCOUNTING_POZNAN_PROJECT_ID = 'project-biura-rachunkowe-poznan';
const TORUN_VERCEL_PROJECT = 'trenerzy-personalni-torun';
const TORUN_VERCEL_BASE_URL = 'https://trenerzy-personalni-torun.vercel.app';
const EMAIL_FILTERS = ['all', 'verified', 'not_found'] as const;
const WORKFLOW_FILTERS = ['all', 'new', 'review', 'ready_to_send', 'sent', 'follow_up', 'closed'] as const;
const DEPLOY_GROUP_FILTERS = ['all', 'new_deploy', 'old_deploy'] as const;
const TABLE_SORT_MODES = ['ready_new_first', 'new_first', 'old_first', 'a_z'] as const;

function nowIso(): string {
  return new Date().toISOString();
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function getDefaultProjectId(projects: Project[]): string {
  const accountingProject = projects.find((project) => project.id === ACCOUNTING_POZNAN_PROJECT_ID);
  if (accountingProject) {
    return accountingProject.id;
  }
  const poznanProject = projects.find((project) => project.id === POZNAN_PROJECT_ID);
  if (poznanProject) {
    return poznanProject.id;
  }
  const torunProject = projects.find((project) => project.id === TORUN_PROJECT_ID);
  return torunProject?.id || projects[0]?.id || '';
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const c = raw[i];
    const n = raw[i + 1];

    if (c === '"') {
      if (inQuotes && n === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && c === ',') {
      row.push(current.trim());
      current = '';
      continue;
    }

    if (!inQuotes && (c === '\n' || c === '\r')) {
      if (c === '\r' && n === '\n') {
        i += 1;
      }
      if (row.length > 0 || current.length > 0) {
        row.push(current.trim());
        rows.push(row);
      }
      row = [];
      current = '';
      continue;
    }

    current += c;
  }

  if (row.length > 0 || current.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
}

function safeHeader(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, '_');
}

function parseCsvObjects(raw: string): Record<string, string>[] {
  const table = parseCsv(raw);
  if (table.length < 2) {
    return [];
  }

  const [headers, ...records] = table;
  const keys = headers.map(safeHeader);
  return records.map((record) => {
    const row: Record<string, string> = {};
    keys.forEach((key, idx) => {
      row[key] = (record[idx] || '').trim();
    });
    return row;
  });
}

function normalizeWebsiteHost(url: string): string {
  const value = (url || '').trim();
  if (!value) {
    return '';
  }

  try {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const host = new URL(normalized).hostname.toLowerCase();
    return host.replace(/^www\./, '');
  } catch {
    return '';
  }
}

const readyAccountingRows = parseCsvObjects(poznanAccountingReadyPagesCsvRaw).filter(
  (row) => row.slug && row.status === 'ready',
);
const readyBiuroSlugs = new Set(readyAccountingRows.map((row) => row.slug));
const readyBiuroSlugByWebsiteHost = new Map(
  readyAccountingRows
    .map((row) => [normalizeWebsiteHost(row.website || ''), row.slug] as const)
    .filter(([host]) => Boolean(host)),
);
const readyBiuroSlugByTitle = new Map(
  readyAccountingRows
    .map((row) => [slugify(row.displayname || row.display_name || ''), row.slug] as const)
    .filter(([titleSlug]) => Boolean(titleSlug)),
);
const readyBiuroVercelProjectBySlug = new Map(
  readyAccountingRows
    .map((row) => [row.slug, row.vercel_project || ''] as const)
    .filter(([, value]) => Boolean(value)),
);
const readyBiuroVercelUrlBySlug = new Map(
  readyAccountingRows
    .map((row) => [row.slug, row.vercel_url || ''] as const)
    .filter(([, value]) => Boolean(value)),
);

function resolveAccountingBiuroSlugFromFields(title: string, website: string, leadSlug = ''): string {
  const byHost = readyBiuroSlugByWebsiteHost.get(normalizeWebsiteHost(website));
  if (byHost) {
    return byHost;
  }

  const byTitle = readyBiuroSlugByTitle.get(slugify(title));
  if (byTitle) {
    return byTitle;
  }

  const strippedSlug = leadSlug.replace(/^poznan-biuro-/, '');
  if (readyBiuroSlugs.has(strippedSlug)) {
    return strippedSlug;
  }

  return '';
}

function buildSeedLeads(projectId: string): Lead[] {
  const queueRows = parseCsvObjects(queueCsvRaw);
  const contactRows = parseCsvObjects(deployedContactsCsvRaw);
  const waveRows = [
    wave1CsvRaw,
    wave2CsvRaw,
    wave2ReplacementCsvRaw,
    wave2Replacement2CsvRaw,
    wave3CsvRaw,
    wave4CsvRaw,
    wave4ReplacementCsvRaw,
    wave4Replacement2CsvRaw,
  ].flatMap((raw) => parseCsvObjects(raw));

  const contactBySlug = new Map(contactRows.map((row) => [row.slug, row]));
  const waveUrlBySlug = new Map(
    waveRows
      .filter((row) => row.slug && row.url)
      .map((row) => [row.slug, row.url]),
  );

  const leads = queueRows
    .filter((row) => row.slug)
    .map((row) => {
      const slug = row.slug;
      const contact = contactBySlug.get(slug) || {};
      const deploymentStatus = row.status || 'unknown';
      const email = contact.email || '';
      const rawEmailStatus = (contact.email_status || (email ? 'risky' : 'not_found')) as Lead['emailStatus'];
      const emailStatus: Lead['emailStatus'] = rawEmailStatus === 'risky' ? 'verified' : rawEmailStatus;
      const workflowStatus: Lead['workflowStatus'] =
        deploymentStatus === 'excluded_non_person'
          ? 'closed'
          : deploymentStatus === 'deployed'
            ? 'review'
            : 'new';
      const vercelProject = row.vercel_project || '';
      const vercelUrl = waveUrlBySlug.get(slug) || (vercelProject ? `https://${vercelProject}.vercel.app` : '');

      return {
        id: uid('lead'),
        projectId,
        deploymentStatus,
        slug,
        title: contact.title || slug,
        email,
        emailStatus: ['verified', 'risky', 'not_found'].includes(emailStatus) ? emailStatus : 'not_found',
        workflowStatus,
        phone: contact.phone || '',
        website: contact.website || '',
        facebook: contact.facebook || '',
        instagram: contact.instagram || '',
        vercelProject,
        vercelUrl,
        priority: deploymentStatus === 'excluded_non_person' ? 'low' : 'medium',
        owner: '',
        tags: deploymentStatus === 'excluded_non_person' ? ['excluded_non_person'] : [],
        nextActionDate: '',
        updatedAt: nowIso(),
      };
    });

  return leads.sort((a, b) => a.title.localeCompare(b.title));
}

function buildTorunSeedLeads(projectId: string): Lead[] {
  const records = parseCsvObjects(torunLeadsCsvRaw);
  const usedSlugs = new Set<string>();

  const leads = records
    .filter((row) => row.nazwa)
    .map((row, i) => {
      const normalizedSlug = slugify(row.nazwa || '') || `lead-${i + 1}`;
      const baseSlug = `torun-${normalizedSlug}`;
      let slug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(slug);

      const email = (row.email || '').split(/[;,]/)[0]?.trim() || '';
      const emailStatus: Lead['emailStatus'] = email ? 'verified' : 'not_found';
      const vercelUrl = `${TORUN_VERCEL_BASE_URL}/?trainer=${slug}`;

      return {
        id: uid('lead'),
        projectId,
        deploymentStatus: 'imported',
        slug,
        title: row.nazwa || slug,
        email,
        emailStatus,
        workflowStatus: email ? 'review' : 'new',
        phone: row.telefon || '',
        website: row.strona_www || '',
        facebook: row.facebook || '',
        instagram: row.instagram || '',
        vercelProject: TORUN_VERCEL_PROJECT,
        vercelUrl,
        priority: 'medium',
        owner: '',
        tags: ['torun_2024'],
        nextActionDate: '',
        updatedAt: nowIso(),
      } satisfies Lead;
    });

  return leads.sort((a, b) => a.title.localeCompare(b.title));
}

function buildPoznanSeedLeads(projectId: string): Lead[] {
  const records = parseCsvObjects(poznanLeadsCsvRaw);
  const usedSlugs = new Set<string>();

  const leads = records
    .filter((row) => row.title)
    .map((row, i) => {
      const normalizedSlug = slugify(row.title || '') || `lead-${i + 1}`;
      const baseSlug = `poznan-${normalizedSlug}`;
      let slug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(slug);

      const email = (row.email || '').split(/[;,]/)[0]?.trim() || '';
      const emailStatus: Lead['emailStatus'] = email ? 'verified' : 'not_found';
      const vercelUrl = `${TORUN_VERCEL_BASE_URL}/?trainer=${slug}`;

      return {
        id: uid('lead'),
        projectId,
        deploymentStatus: 'imported',
        slug,
        title: row.title || slug,
        email,
        emailStatus,
        workflowStatus: email ? 'review' : 'new',
        phone: row.phone || '',
        website: row.website || '',
        facebook: row.facebook || '',
        instagram: row.instagram || '',
        vercelProject: TORUN_VERCEL_PROJECT,
        vercelUrl,
        priority: 'medium',
        owner: '',
        tags: ['poznan_2026'],
        nextActionDate: '',
        updatedAt: nowIso(),
      } satisfies Lead;
    });

  return leads.sort((a, b) => a.title.localeCompare(b.title));
}

function buildGdanskSeedLeads(projectId: string): Lead[] {
  const records = parseCsvObjects(gdanskLeadsCsvRaw);
  const usedSlugs = new Set<string>();

  const leads = records
    .filter((row) => row.title)
    .map((row, i) => {
      const normalizedSlug = slugify(row.title || '') || `lead-${i + 1}`;
      const baseSlug = `gdansk-${normalizedSlug}`;
      let slug = baseSlug;
      let suffix = 2;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(slug);

      const email = (row.email || '').split(/[;,]/)[0]?.trim() || '';
      const emailStatus: Lead['emailStatus'] = email ? 'verified' : 'not_found';
      const vercelUrl = `${TORUN_VERCEL_BASE_URL}/?trainer=${slug}`;

      return {
        id: uid('lead'),
        projectId,
        deploymentStatus: 'imported',
        slug,
        title: row.title || slug,
        email,
        emailStatus,
        workflowStatus: email ? 'review' : 'new',
        phone: row.phone || '',
        website: row.website || '',
        facebook: row.facebook || '',
        instagram: row.instagram || '',
        vercelProject: TORUN_VERCEL_PROJECT,
        vercelUrl,
        priority: 'medium',
        owner: '',
        tags: ['gdansk_2026'],
        nextActionDate: '',
        updatedAt: nowIso(),
      } satisfies Lead;
    });

  return leads.sort((a, b) => a.title.localeCompare(b.title));
}

function extractSocialLink(raw: string, keyword: string): string {
  if (!raw) {
    return '';
  }

  const parts = raw
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.find((part) => part.toLowerCase().includes(keyword)) || '';
}

function buildPoznanAccountingSeedLeads(projectId: string): Lead[] {
  const records = parseCsvObjects(poznanAccountingLeadsCsvRaw);
  const usedSlugs = new Set<string>();

  const leads = records
    .filter((row) => row.imie || row.title || row.nazwa)
    .map((row, i) => {
      const title = row.imie || row.title || row.nazwa || `lead-${i + 1}`;
      const normalizedSlug = slugify(title) || `lead-${i + 1}`;
      const baseSlug = `poznan-biuro-${normalizedSlug}`;
      let slug = baseSlug;
      let suffix = 2;

      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
      }
      usedSlugs.add(slug);

      const email = (row.email || '')
        .split(/[|;,]/)
        .map((part) => part.trim())
        .find(Boolean) || '';

      const socialRaw = row.social_media || '';
      const emailStatus: Lead['emailStatus'] = email ? 'verified' : 'not_found';
      const resolvedBiuroSlug = resolveAccountingBiuroSlugFromFields(title, row.strona || row.website || row.strona_www || '', slug);

      return {
        id: uid('lead'),
        projectId,
        deploymentStatus: 'imported',
        slug,
        title,
        email,
        emailStatus,
        workflowStatus: email ? 'review' : 'new',
        phone: row.numer || row.phone || row.telefon || '',
        website: row.strona || row.website || row.strona_www || '',
        facebook: row.facebook || extractSocialLink(socialRaw, 'facebook'),
        instagram: row.instagram || extractSocialLink(socialRaw, 'instagram'),
        vercelProject: readyBiuroVercelProjectBySlug.get(resolvedBiuroSlug) || 'biura-rachunkowe-poznan',
        vercelUrl: readyBiuroVercelUrlBySlug.get(resolvedBiuroSlug) || row.url || '',
        priority: 'medium',
        owner: '',
        tags: ['biura_rachunkowe_poznan_2026'],
        nextActionDate: '',
        updatedAt: nowIso(),
      } satisfies Lead;
    });

  return leads.sort((a, b) => a.title.localeCompare(b.title));
}

function csvToLeads(raw: string, projectId: string): Lead[] {
  const records = parseCsvObjects(raw);
  return records.map((row, i) => {

    const slug = row.slug || `lead-${i + 1}`;
    const rawEmailStatus = (row.email_status || 'not_found') as Lead['emailStatus'];
    const emailStatus: Lead['emailStatus'] = rawEmailStatus === 'risky' ? 'verified' : rawEmailStatus;

    return {
      id: uid('lead'),
      projectId,
      deploymentStatus: row.deployment_status || 'imported',
      slug,
      title: row.title || slug,
      email: row.email || '',
      emailStatus: ['verified', 'risky', 'not_found'].includes(emailStatus) ? emailStatus : 'not_found',
      workflowStatus: 'new',
      phone: row.phone || '',
      website: row.website || '',
      facebook: row.facebook || '',
      instagram: row.instagram || '',
      vercelProject: row.vercel_project || '',
      vercelUrl: row.vercel_url || '',
      priority: 'medium',
      owner: '',
      tags: [],
      nextActionDate: '',
      updatedAt: nowIso(),
    };
  });
}

function normalizeLead(lead: Lead): Lead {
  return {
    ...lead,
    deploymentStatus: lead.deploymentStatus || 'deployed',
    emailStatus: lead.emailStatus === 'risky' ? 'verified' : lead.emailStatus,
  };
}

function resolveAccountingBiuroSlug(lead: Lead): string {
  return resolveAccountingBiuroSlugFromFields(lead.title, lead.website, lead.slug);
}

function buildLocalTrainerUrl(lead: Lead): string {
  if (lead.projectId === ACCOUNTING_POZNAN_PROJECT_ID) {
    if (lead.vercelUrl && /^https?:\/\//i.test(lead.vercelUrl) && !lead.vercelUrl.includes('google.com/maps')) {
      return lead.vercelUrl;
    }
    const biuroSlug = resolveAccountingBiuroSlug(lead);
    if (biuroSlug) {
      return `http://127.0.0.1:3000/?biuro=${biuroSlug}`;
    }
  }

  if (typeof window === 'undefined') {
    return `http://127.0.0.1:3000/?trainer=${lead.slug}`;
  }

  return `${window.location.origin}/?trainer=${lead.slug}`;
}

function getLocalPageStatus(lead: Lead): 'ready' | 'not_ready' | 'n_a' {
  if (lead.projectId !== ACCOUNTING_POZNAN_PROJECT_ID) {
    return 'n_a';
  }

  return resolveAccountingBiuroSlug(lead) ? 'ready' : 'not_ready';
}

function initialState(): CrmState {
  const ts = nowIso();
  const bydgoszczProject: Project = {
    id: BYDGOSZCZ_PROJECT_ID,
    name: 'Trenerzy personalni - Bydgoszcz',
    description: 'Projekt glowny: leady i strony trenerow z Bydgoszczy.',
    createdAt: ts,
    updatedAt: ts,
  };
  const torunProject: Project = {
    id: TORUN_PROJECT_ID,
    name: 'Trenerzy personalni - Torun',
    description: 'Projekt: baza leadow trenerow personalnych z Torunia.',
    createdAt: ts,
    updatedAt: ts,
  };
  const poznanProject: Project = {
    id: POZNAN_PROJECT_ID,
    name: 'Trenerzy personalni - Poznan',
    description: 'Projekt: solo trenerzy personalni z Poznania (manualny follow-up maili).',
    createdAt: ts,
    updatedAt: ts,
  };
  const gdanskProject: Project = {
    id: GDANSK_PROJECT_ID,
    name: 'Trenerzy personalni - Gdansk',
    description: 'Projekt: baza leadow trenerow personalnych z Gdanska.',
    createdAt: ts,
    updatedAt: ts,
  };
  const accountingPoznanProject: Project = {
    id: ACCOUNTING_POZNAN_PROJECT_ID,
    name: 'Biura rachunkowe - Poznan',
    description: 'Projekt: nasze leady biur rachunkowych z Poznania.',
    createdAt: ts,
    updatedAt: ts,
  };

  return {
    projects: [bydgoszczProject, torunProject, poznanProject, gdanskProject, accountingPoznanProject],
    leads: [
      ...buildSeedLeads(BYDGOSZCZ_PROJECT_ID),
      ...buildTorunSeedLeads(TORUN_PROJECT_ID),
      ...buildPoznanSeedLeads(POZNAN_PROJECT_ID),
      ...buildGdanskSeedLeads(GDANSK_PROJECT_ID),
      ...buildPoznanAccountingSeedLeads(ACCOUNTING_POZNAN_PROJECT_ID),
    ],
    notes: [],
    activity: [],
    imports: [],
  };
}

function mergeProjectSeedLeads(state: CrmState, projectId: string, seedLeads: Lead[]): CrmState {
  const currentProjectLeads = state.leads.filter((lead) => lead.projectId === projectId);
  const otherProjectLeads = state.leads.filter((lead) => lead.projectId !== projectId);

  const existingBySlug = new Map(currentProjectLeads.map((lead) => [lead.slug, lead]));
  const mergedBySlug = new Map<string, Lead>();

  seedLeads.forEach((seedLead) => {
    const existing = existingBySlug.get(seedLead.slug);
    if (!existing) {
      mergedBySlug.set(seedLead.slug, seedLead);
      return;
    }

    mergedBySlug.set(seedLead.slug, {
      ...existing,
      deploymentStatus: seedLead.deploymentStatus || existing.deploymentStatus,
      title: existing.title && existing.title !== existing.slug ? existing.title : seedLead.title,
      email: seedLead.email || existing.email,
      emailStatus: seedLead.email ? seedLead.emailStatus : existing.emailStatus,
      phone: existing.phone || seedLead.phone,
      website: existing.website || seedLead.website,
      facebook: existing.facebook || seedLead.facebook,
      instagram: existing.instagram || seedLead.instagram,
      vercelProject: seedLead.vercelProject || existing.vercelProject,
      vercelUrl: seedLead.vercelUrl || existing.vercelUrl,
      priority: existing.priority || seedLead.priority,
    });
  });

  const mergedProjectLeads = Array.from(mergedBySlug.values()).sort((a, b) => a.title.localeCompare(b.title));

  return {
    ...state,
    leads: [...otherProjectLeads, ...mergedProjectLeads],
  };
}

function syncLeadsWithSeed(state: CrmState): CrmState {
  const seededProjects: Project[] = [
    {
      id: BYDGOSZCZ_PROJECT_ID,
      name: 'Trenerzy personalni - Bydgoszcz',
      description: 'Projekt glowny: leady i strony trenerow z Bydgoszczy.',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: TORUN_PROJECT_ID,
      name: 'Trenerzy personalni - Torun',
      description: 'Projekt: baza leadow trenerow personalnych z Torunia.',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: POZNAN_PROJECT_ID,
      name: 'Trenerzy personalni - Poznan',
      description: 'Projekt: solo trenerzy personalni z Poznania (manualny follow-up maili).',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: GDANSK_PROJECT_ID,
      name: 'Trenerzy personalni - Gdansk',
      description: 'Projekt: baza leadow trenerow personalnych z Gdanska.',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: ACCOUNTING_POZNAN_PROJECT_ID,
      name: 'Biura rachunkowe - Poznan',
      description: 'Projekt: nasze leady biur rachunkowych z Poznania.',
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  const existingIds = new Set(state.projects.map((project) => project.id));
  const mergedProjects = [...state.projects];
  seededProjects.forEach((project) => {
    if (!existingIds.has(project.id)) {
      mergedProjects.push(project);
    }
  });

  let merged = { ...state, projects: mergedProjects };
  merged = mergeProjectSeedLeads(merged, BYDGOSZCZ_PROJECT_ID, buildSeedLeads(BYDGOSZCZ_PROJECT_ID));
  merged = mergeProjectSeedLeads(merged, TORUN_PROJECT_ID, buildTorunSeedLeads(TORUN_PROJECT_ID));
  merged = mergeProjectSeedLeads(merged, POZNAN_PROJECT_ID, buildPoznanSeedLeads(POZNAN_PROJECT_ID));
  merged = mergeProjectSeedLeads(merged, GDANSK_PROJECT_ID, buildGdanskSeedLeads(GDANSK_PROJECT_ID));
  merged = mergeProjectSeedLeads(
    merged,
    ACCOUNTING_POZNAN_PROJECT_ID,
    buildPoznanAccountingSeedLeads(ACCOUNTING_POZNAN_PROJECT_ID),
  );
  return merged;
}

function loadState(): CrmState {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initialState();
  }

  try {
    const parsed = JSON.parse(stored) as CrmState;
    if (!parsed.projects || !parsed.leads || !parsed.notes || !parsed.activity || !parsed.imports) {
      return initialState();
    }
    const synced = syncLeadsWithSeed(parsed);
    return {
      ...synced,
      leads: synced.leads.map((lead) => normalizeLead(lead)),
    };
  } catch {
    return initialState();
  }
}

function saveState(state: CrmState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function leadsToCsv(leads: Lead[]): string {
  const headers = [
    'deployment_status',
    'slug',
    'title',
    'email',
    'email_status',
    'workflow_status',
    'phone',
    'website',
    'facebook',
    'instagram',
    'vercel_project',
    'vercel_url',
    'priority',
    'owner',
    'tags',
    'next_action_date',
    'updated_at',
  ];

  const rows = leads.map((lead) =>
    [
      lead.deploymentStatus,
      lead.slug,
      lead.title,
      lead.email,
      lead.emailStatus,
      lead.workflowStatus,
      lead.phone,
      lead.website,
      lead.facebook,
      lead.instagram,
      lead.vercelProject,
      lead.vercelUrl,
      lead.priority,
      lead.owner,
      lead.tags.join(';'),
      lead.nextActionDate,
      lead.updatedAt,
    ]
      .map((value) => escapeCsv(value || ''))
      .join(','),
  );

  return `${headers.join(',')}\n${rows.join('\n')}`;
}

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function CrmApp() {
  const [state, setState] = React.useState<CrmState>(() => loadState());
  const [activeProjectId, setActiveProjectId] = React.useState<string>(() => getDefaultProjectId(loadState().projects));
  const [activeTab, setActiveTab] = React.useState<'leads' | 'mailing'>('leads');
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>('');
  const [search, setSearch] = React.useState('');
  const [emailFilter, setEmailFilter] = React.useState<(typeof EMAIL_FILTERS)[number]>('all');
  const [workflowFilter, setWorkflowFilter] = React.useState<(typeof WORKFLOW_FILTERS)[number]>('all');
  const [deployGroupFilter, setDeployGroupFilter] = React.useState<(typeof DEPLOY_GROUP_FILTERS)[number]>('all');
  const [sortMode, setSortMode] = React.useState<(typeof TABLE_SORT_MODES)[number]>('ready_new_first');
  const [readyOnly, setReadyOnly] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');
  const [newProjectDescription, setNewProjectDescription] = React.useState('');
  const [importMode, setImportMode] = React.useState<'merge' | 'replace'>('merge');
  const [newNote, setNewNote] = React.useState('');
  const [lastImportMsg, setLastImportMsg] = React.useState('');
  const [actionMsg, setActionMsg] = React.useState('');
  const [mailTone, setMailTone] = React.useState<'friendly' | 'premium' | 'direct'>('friendly');

  const outreachPlans = React.useMemo(() => {
    const rows = parseCsvObjects(outreachPlaybookCsvRaw);
    return rows.map(
      (row): OutreachPlan => ({
        slug: row.slug || '',
        first_name: row.first_name || '',
        source_type: row.source_type || '',
        confidence: row.confidence || '',
        niche: row.niche || '',
        opener_line: row.opener_line || '',
        quick_win: row.quick_win || '',
        tone_recommendation: row.tone_recommendation || '',
        subject_1: row.subject_1 || '',
        subject_alt_1: row.subject_alt_1 || '',
        email_1: row.email_1 || '',
        email_1_friendly: row.email_1_friendly || '',
        email_1_premium: row.email_1_premium || '',
        email_1_direct: row.email_1_direct || '',
        followup_1: row.followup_1 || '',
        followup_2: row.followup_2 || '',
        followup_3: row.followup_3 || '',
        dm_1: row.dm_1 || '',
        dm_followup: row.dm_followup || '',
        phone_opening: row.phone_opening || '',
        research_notes: row.research_notes || '',
        cta: row.cta || '',
        playbook_version: row.playbook_version || '',
      }),
    );
  }, []);

  const outreachPlanBySlug = React.useMemo(() => {
    const map = new Map<string, OutreachPlan>();
    outreachPlans.forEach((plan) => {
      if (plan.slug) {
        map.set(plan.slug, plan);
      }
    });
    return map;
  }, [outreachPlans]);

  const syncFromSourceCsv = React.useCallback(() => {
    setState((prev) => syncLeadsWithSeed(prev));
    setActiveProjectId((prev) => prev || POZNAN_PROJECT_ID);
    setSelectedLeadId('');
    setEmailFilter('all');
    setWorkflowFilter('all');
    setDeployGroupFilter('all');
    setSortMode('ready_new_first');
    setReadyOnly(false);
    setLastImportMsg('Synced from source CSV files (manual emails preserved).');
  }, []);

  React.useEffect(() => {
    saveState(state);
  }, [state]);

  React.useEffect(() => {
    if (!activeProjectId && state.projects[0]) {
      setActiveProjectId(getDefaultProjectId(state.projects));
    }
  }, [activeProjectId, state.projects]);

  const redeployStatusBySlug = React.useMemo(() => {
    const map = new Map<string, string>();
    const rows = parseCsvObjects(redeployResultsCsvRaw);
    rows.forEach((row) => {
      const slug = (row.slug || '').trim();
      const status = (row.status || '').trim();
      if (slug) {
        map.set(slug, status);
      }
    });
    return map;
  }, []);

  const getDeployGroup = React.useCallback(
    (lead: Lead): 'new_deploy' | 'old_deploy' => {
      const redeployStatus = redeployStatusBySlug.get(lead.slug);
      if (redeployStatus === 'deployed') {
        return 'new_deploy';
      }
      return 'old_deploy';
    },
    [redeployStatusBySlug],
  );

  const projectLeads = React.useMemo(
    () => state.leads.filter((lead) => lead.projectId === activeProjectId),
    [state.leads, activeProjectId],
  );

  const filteredLeads = React.useMemo(() => {
    const term = search.toLowerCase().trim();
    const filtered = projectLeads.filter((lead) => {
      if (emailFilter !== 'all' && lead.emailStatus !== emailFilter) {
        return false;
      }
      if (workflowFilter !== 'all' && lead.workflowStatus !== workflowFilter) {
        return false;
      }
      if (deployGroupFilter !== 'all' && getDeployGroup(lead) !== deployGroupFilter) {
        return false;
      }
      if (readyOnly && !(lead.emailStatus === 'verified' || lead.emailStatus === 'risky')) {
        return false;
      }
      if (!term) {
        return true;
      }
      return [lead.slug, lead.title, lead.email, lead.phone, lead.website, lead.vercelUrl]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });

    const score = (lead: Lead) => {
      const ready = lead.emailStatus === 'verified' || lead.emailStatus === 'risky' ? 1 : 0;
      const deployNew = getDeployGroup(lead) === 'new_deploy' ? 1 : 0;
      const localReadyPage =
        lead.projectId === ACCOUNTING_POZNAN_PROJECT_ID && resolveAccountingBiuroSlug(lead) ? 1 : 0;
      return { ready, deployNew, localReadyPage };
    };

    filtered.sort((a, b) => {
      const localReadyDiff = score(b).localReadyPage - score(a).localReadyPage;
      if (localReadyDiff !== 0) {
        return localReadyDiff;
      }

      if (sortMode === 'a_z') {
        return a.title.localeCompare(b.title);
      }
      if (sortMode === 'new_first') {
        const d = score(b).deployNew - score(a).deployNew;
        if (d !== 0) {
          return d;
        }
        return a.title.localeCompare(b.title);
      }
      if (sortMode === 'old_first') {
        const d = score(a).deployNew - score(b).deployNew;
        if (d !== 0) {
          return d;
        }
        return a.title.localeCompare(b.title);
      }

      const readyDiff = score(b).ready - score(a).ready;
      if (readyDiff !== 0) {
        return readyDiff;
      }
      const deployDiff = score(b).deployNew - score(a).deployNew;
      if (deployDiff !== 0) {
        return deployDiff;
      }
      return a.title.localeCompare(b.title);
    });

    return filtered;
  }, [projectLeads, emailFilter, workflowFilter, deployGroupFilter, readyOnly, search, sortMode, getDeployGroup]);

  const selectedLead = React.useMemo(
    () => state.leads.find((lead) => lead.id === selectedLeadId) || filteredLeads[0] || null,
    [state.leads, selectedLeadId, filteredLeads],
  );

  const selectedPlan = React.useMemo(
    () => (selectedLead ? outreachPlanBySlug.get(selectedLead.slug) || null : null),
    [selectedLead, outreachPlanBySlug],
  );

  React.useEffect(() => {
    if (!selectedPlan?.tone_recommendation) {
      setMailTone('friendly');
      return;
    }
    const tone = selectedPlan.tone_recommendation as 'friendly' | 'premium' | 'direct';
    if (tone === 'friendly' || tone === 'premium' || tone === 'direct') {
      setMailTone(tone);
    }
  }, [selectedPlan?.slug, selectedPlan?.tone_recommendation]);

  const firstEmailByTone = React.useMemo(() => {
    if (!selectedPlan) {
      return '';
    }
    if (mailTone === 'premium') {
      return selectedPlan.email_1_premium || selectedPlan.email_1;
    }
    if (mailTone === 'direct') {
      return selectedPlan.email_1_direct || selectedPlan.email_1;
    }
    return selectedPlan.email_1_friendly || selectedPlan.email_1;
  }, [selectedPlan, mailTone]);

  const copyBlock = React.useCallback(async (label: string, text: string) => {
    if (!text.trim()) {
      setActionMsg(`Brak tresci: ${label}`);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setActionMsg(`Skopiowano: ${label}`);
      window.setTimeout(() => setActionMsg(''), 1800);
    } catch {
      setActionMsg('Nie udalo sie skopiowac do schowka.');
      window.setTimeout(() => setActionMsg(''), 2200);
    }
  }, []);

  const exportPlaybook = React.useCallback(() => {
    downloadText('personalized_outreach_playbook.csv', outreachPlaybookCsvRaw);
    setActionMsg('Wyeksportowano personalized_outreach_playbook.csv');
    window.setTimeout(() => setActionMsg(''), 2200);
  }, []);

  React.useEffect(() => {
    if (selectedLead && selectedLead.id !== selectedLeadId) {
      setSelectedLeadId(selectedLead.id);
    }
  }, [selectedLead, selectedLeadId]);

  const selectedLeadNotes = React.useMemo(
    () => state.notes.filter((note) => note.leadId === selectedLead?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state.notes, selectedLead?.id],
  );

  const selectedLeadActivity = React.useMemo(
    () => state.activity.filter((item) => item.leadId === selectedLead?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12),
    [state.activity, selectedLead?.id],
  );

  const activeProject = state.projects.find((project) => project.id === activeProjectId) || null;

  const metrics = React.useMemo(() => {
    const actionable = projectLeads.filter((lead) => lead.deploymentStatus !== 'excluded_non_person');
    const total = actionable.length;
    const excluded = projectLeads.length - actionable.length;
    const withEmail = actionable.filter((lead) => lead.email).length;
    const verified = actionable.filter((lead) => lead.emailStatus === 'verified').length;
    const risky = actionable.filter((lead) => lead.emailStatus === 'risky').length;
    const notFound = actionable.filter((lead) => lead.emailStatus === 'not_found').length;
    const readyToSend = actionable.filter((lead) => lead.workflowStatus === 'ready_to_send').length;
    return { total, excluded, withEmail, verified, risky, notFound, readyToSend };
  }, [projectLeads]);

  const deployReadyMetrics = React.useMemo(() => {
    const ready = projectLeads.filter((lead) => lead.emailStatus === 'verified' || lead.emailStatus === 'risky');
    const newReady = ready.filter((lead) => getDeployGroup(lead) === 'new_deploy').length;
    const oldReady = ready.filter((lead) => getDeployGroup(lead) === 'old_deploy').length;
    return { newReady, oldReady, totalReady: ready.length };
  }, [projectLeads, getDeployGroup]);

  const addActivity = React.useCallback((leadId: string, action: string, details: string) => {
    setState((prev) => ({
      ...prev,
      activity: [{ id: uid('act'), leadId, action, details, createdAt: nowIso() }, ...prev.activity],
    }));
  }, []);

  const updateLeadField = (field: keyof Lead, value: string) => {
    if (!selectedLead) {
      return;
    }

    const previous = String(selectedLead[field] ?? '');
    if (previous === value) {
      return;
    }

    setState((prev) => ({
      ...prev,
      leads: prev.leads.map((lead) =>
        lead.id === selectedLead.id
          ? {
              ...lead,
              [field]: value,
              updatedAt: nowIso(),
            }
          : lead,
      ),
    }));

    addActivity(selectedLead.id, 'field_update', `${field}: "${previous}" -> "${value}"`);
  };

  const createProject = () => {
    const name = newProjectName.trim();
    if (!name) {
      return;
    }

    const project: Project = {
      id: uid('project'),
      name,
      description: newProjectDescription.trim(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    setState((prev) => ({ ...prev, projects: [...prev.projects, project] }));
    setActiveProjectId(project.id);
    setSelectedLeadId('');
    setNewProjectName('');
    setNewProjectDescription('');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeProjectId) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const incoming = csvToLeads(text, activeProjectId);
      let added = 0;
      let updated = 0;
      let skipped = 0;

      setState((prev) => {
        const existingProjectLeads = prev.leads.filter((lead) => lead.projectId === activeProjectId);
        const outsideProjectLeads = prev.leads.filter((lead) => lead.projectId !== activeProjectId);

        if (importMode === 'replace') {
          added = incoming.length;
          return {
            ...prev,
            leads: [...outsideProjectLeads, ...incoming],
            imports: [
              {
                id: uid('import'),
                projectId: activeProjectId,
                fileName: file.name,
                mode: importMode,
                added,
                updated,
                skipped,
                createdAt: nowIso(),
              },
              ...prev.imports,
            ],
          };
        }

        const bySlug = new Map(existingProjectLeads.map((lead) => [lead.slug, lead]));
        const merged = [...existingProjectLeads];

        for (const lead of incoming) {
          const existing = bySlug.get(lead.slug);
          if (!existing) {
            merged.push(lead);
            bySlug.set(lead.slug, lead);
            added += 1;
            continue;
          }

          const changed =
            existing.title !== lead.title ||
            existing.email !== lead.email ||
            existing.phone !== lead.phone ||
            existing.website !== lead.website ||
            existing.vercelUrl !== lead.vercelUrl;

          if (!changed) {
            skipped += 1;
            continue;
          }

          updated += 1;
          const mergedLead: Lead = {
            ...existing,
            deploymentStatus: lead.deploymentStatus || existing.deploymentStatus,
            title: lead.title || existing.title,
            email: lead.email || existing.email,
            emailStatus: lead.emailStatus || existing.emailStatus,
            phone: lead.phone || existing.phone,
            website: lead.website || existing.website,
            facebook: lead.facebook || existing.facebook,
            instagram: lead.instagram || existing.instagram,
            vercelProject: lead.vercelProject || existing.vercelProject,
            vercelUrl: lead.vercelUrl || existing.vercelUrl,
            updatedAt: nowIso(),
          };

          const index = merged.findIndex((x) => x.id === existing.id);
          merged[index] = mergedLead;
          bySlug.set(lead.slug, mergedLead);
        }

        return {
          ...prev,
          leads: [...outsideProjectLeads, ...merged],
          imports: [
            {
              id: uid('import'),
              projectId: activeProjectId,
              fileName: file.name,
              mode: importMode,
              added,
              updated,
              skipped,
              createdAt: nowIso(),
            },
            ...prev.imports,
          ],
        };
      });

      setLastImportMsg(`Import done: added ${added}, updated ${updated}, skipped ${skipped}`);
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const addNote = () => {
    if (!selectedLead || !newNote.trim()) {
      return;
    }

    const note: LeadNote = {
      id: uid('note'),
      leadId: selectedLead.id,
      text: newNote.trim(),
      pinned: false,
      createdAt: nowIso(),
    };

    setState((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
    addActivity(selectedLead.id, 'note_add', newNote.trim());
    setNewNote('');
  };

  const togglePinned = (noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) => (note.id === noteId ? { ...note, pinned: !note.pinned } : note)),
    }));
  };

  const exportCurrentProject = () => {
    if (!activeProject) {
      return;
    }
    const csv = leadsToCsv(projectLeads);
    downloadText(`${activeProject.name.replace(/\s+/g, '_').toLowerCase()}_export.csv`, csv);
  };

  const exportReadyToSend = () => {
    if (!activeProject) {
      return;
    }
    const ready = projectLeads.filter((lead) => ['verified', 'risky'].includes(lead.emailStatus));
    const csv = leadsToCsv(ready);
    downloadText(`${activeProject.name.replace(/\s+/g, '_').toLowerCase()}_send_now.csv`, csv);
  };

  const lastRuns = state.imports.filter((item) => item.projectId === activeProjectId).slice(0, 5);
  const projectStats = React.useMemo(() => {
    const map: Record<string, { total: number; verified: number; pending: number }> = {};
    state.projects.forEach((project) => {
      const leads = state.leads.filter(
        (lead) => lead.projectId === project.id && lead.deploymentStatus !== 'excluded_non_person',
      );
      map[project.id] = {
        total: leads.length,
        verified: leads.filter((lead) => lead.emailStatus === 'verified').length,
        pending: leads.filter((lead) => lead.emailStatus === 'not_found').length,
      };
    });
    return map;
  }, [state.leads, state.projects]);

  const emailPill = (status: Lead['emailStatus']) => {
    if (status === 'verified') {
      return 'bg-emerald-950/50 text-emerald-300 border-emerald-700/60';
    }
    if (status === 'risky') {
      return 'bg-amber-950/50 text-amber-300 border-amber-700/60';
    }
    return 'bg-rose-950/50 text-rose-300 border-rose-700/60';
  };

  const workflowPill = (status: Lead['workflowStatus']) => {
    if (status === 'ready_to_send' || status === 'sent') {
      return 'bg-sky-950/50 text-sky-300 border-sky-700/60';
    }
    if (status === 'follow_up') {
      return 'bg-violet-950/50 text-violet-300 border-violet-700/60';
    }
    return 'bg-slate-800 text-slate-200 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100" style={{ fontFamily: "'Fira Sans', Inter, sans-serif", colorScheme: 'dark' }}>
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8">
        <header className="mb-6 rounded-3xl border border-slate-700 bg-slate-900/90 p-6 shadow-lg shadow-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-sky-300">
                <FolderKanban className="h-3.5 w-3.5" /> Project-based CRM
              </p>
              <h1 className="text-3xl font-black tracking-tight text-slate-100" style={{ fontFamily: "'Fira Code', 'Fira Sans', monospace" }}>
                Lead Operations Control Center
              </h1>
              <p className="mt-1 text-sm text-slate-300">Import baz, kontrola jakosci leadow, notatki operacyjne i szybki dostep do stron Vercel.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <div className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2"><p className="text-slate-400">Leady</p><p className="font-bold text-slate-100">{metrics.total}</p></div>
              <div className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2"><p className="text-slate-400">Z emailem</p><p className="font-bold text-slate-100">{metrics.withEmail}</p></div>
              <div className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2"><p className="text-slate-400">Ready</p><p className="font-bold text-sky-300">{metrics.readyToSend}</p></div>
              <div className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2"><p className="text-slate-400">Braki</p><p className="font-bold text-rose-300">{metrics.notFound}</p></div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Projekty</p>
              <div className="space-y-2">
                {state.projects.map((project) => {
                  const stats = projectStats[project.id] || { total: 0, verified: 0, pending: 0 };
                  const active = project.id === activeProjectId;
                  return (
                    <button
                      key={project.id}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`w-full cursor-pointer rounded-xl border px-3 py-2 text-left transition-colors ${
                        active
                          ? 'border-sky-500 bg-sky-950/40'
                          : 'border-slate-700 bg-slate-900 hover:border-slate-500 hover:bg-slate-800'
                      }`}
                    >
                      <p className="truncate text-sm font-semibold text-slate-100">{project.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <span>{stats.total} leadow</span>
                        <span className="text-emerald-300">{stats.verified} approved</span>
                        <span className="text-rose-300">{stats.pending} missing</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Nowy projekt</p>
              <div className="space-y-2">
                <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500" placeholder="Nazwa projektu" value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} />
                <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500" placeholder="Opis projektu" value={newProjectDescription} onChange={(event) => setNewProjectDescription(event.target.value)} />
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700" onClick={createProject}>
                  <Plus className="h-4 w-4" /> Dodaj projekt
                </button>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Importy</p>
              <div className="space-y-2">
                {lastRuns.length === 0 && <p className="text-xs text-slate-500">Brak historii importow.</p>}
                {lastRuns.map((run) => (
                  <div key={run.id} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs">
                    <p className="truncate font-semibold text-slate-200">{run.fileName}</p>
                    <p className="text-slate-400">{run.createdAt.slice(0, 19).replace('T', ' ')}</p>
                    <p className="mt-1 text-slate-300">A:{run.added} U:{run.updated} S:{run.skipped}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <main className="space-y-4">
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'leads'
                      ? 'border-sky-600 bg-sky-950/50 text-sky-200'
                      : 'border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800'
                  }`}
                  onClick={() => setActiveTab('leads')}
                >
                  Leads
                </button>
                <button
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                    activeTab === 'mailing'
                      ? 'border-sky-600 bg-sky-950/50 text-sky-200'
                      : 'border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800'
                  }`}
                  onClick={() => setActiveTab('mailing')}
                >
                  Mailing
                </button>
                <button
                  className="ml-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-700"
                  onClick={exportPlaybook}
                >
                  <FileDown className="h-4 w-4" /> Export playbook
                </button>
              </div>
              {actionMsg && <p className="mt-2 text-xs font-medium text-emerald-300">{actionMsg}</p>}
              <p className="mt-2 text-xs text-slate-400">Tryb outreach: najpierw demo strony, oferta dopiero po pozytywnej reakcji.</p>
            </section>

            {activeTab === 'leads' && (
            <section className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
              <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto_auto_auto_auto_auto_auto] lg:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500" placeholder="Szukaj po nazwie, slug, emailu, www" value={search} onChange={(event) => setSearch(event.target.value)} />
                </div>
                <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" value={emailFilter} onChange={(event) => setEmailFilter(event.target.value as (typeof EMAIL_FILTERS)[number])}>
                  {EMAIL_FILTERS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" value={workflowFilter} onChange={(event) => setWorkflowFilter(event.target.value as (typeof WORKFLOW_FILTERS)[number])}>
                  {WORKFLOW_FILTERS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" value={importMode} onChange={(event) => setImportMode(event.target.value as 'merge' | 'replace')}>
                  <option value="merge">import merge</option>
                  <option value="replace">import replace</option>
                </select>
                <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" value={deployGroupFilter} onChange={(event) => setDeployGroupFilter(event.target.value as (typeof DEPLOY_GROUP_FILTERS)[number])}>
                  <option value="all">all deploys</option>
                  <option value="new_deploy">new deploy</option>
                  <option value="old_deploy">old deploy</option>
                </select>
                <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100" value={sortMode} onChange={(event) => setSortMode(event.target.value as (typeof TABLE_SORT_MODES)[number])}>
                  <option value="ready_new_first">ready + new first</option>
                  <option value="new_first">new deploy first</option>
                  <option value="old_first">old deploy first</option>
                  <option value="a_z">a-z</option>
                </select>
                <button className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${readyOnly ? 'border-emerald-600 bg-emerald-900/40 text-emerald-200' : 'border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800'}`} onClick={() => setReadyOnly((v) => !v)}>
                  {readyOnly ? 'ready only: ON' : 'ready only: OFF'}
                </button>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
                  <FileUp className="h-4 w-4" /> Import
                  <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
                </label>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700" onClick={exportCurrentProject}>
                  <FileDown className="h-4 w-4" /> Export all
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800" onClick={exportReadyToSend}>
                  <Send className="h-4 w-4" /> Export send_now
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-700" onClick={syncFromSourceCsv}>
                  Sync from CSV
                </button>
              </div>
              {lastImportMsg && <p className="mt-2 text-xs font-medium text-sky-300">{lastImportMsg}</p>}
              {activeProject && <p className="mt-2 text-xs text-slate-400">{activeProject.description || 'Brak opisu projektu.'}</p>}
              <p className="mt-2 text-xs text-slate-400">Ready to send: {deployReadyMetrics.totalReady} (new deploy: {deployReadyMetrics.newReady}, old deploy: {deployReadyMetrics.oldReady})</p>
            </section>
            )}

            {activeTab === 'mailing' && (
              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_460px]">
                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-sm">
                  <div className="max-h-[700px] overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-950 text-xs uppercase tracking-wide text-slate-300">
                        <tr>
                          <th className="px-3 py-3">Lead</th>
                          <th className="px-3 py-3">Kontakt</th>
                          <th className="px-3 py-3">Plan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLeads.map((lead, idx) => {
                          const plan = outreachPlanBySlug.get(lead.slug);
                          const hasEmail = Boolean(lead.email);
                          return (
                            <tr
                              key={lead.id}
                              className={`cursor-pointer border-t border-slate-800 transition-colors ${selectedLead?.id === lead.id ? 'bg-sky-950/40 ring-1 ring-inset ring-sky-700' : idx % 2 === 0 ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-950 hover:bg-slate-900'}`}
                              onClick={() => setSelectedLeadId(lead.id)}
                            >
                              <td className="px-3 py-3 align-top">
                                <p className="font-semibold text-slate-100">{lead.title}</p>
                                <p className="mt-0.5 text-xs text-slate-400">{lead.slug}</p>
                              </td>
                              <td className="px-3 py-3 align-top text-xs text-slate-300">
                                <p className="truncate">{lead.email || '-'}</p>
                                <p>{lead.phone || '-'}</p>
                              </td>
                              <td className="px-3 py-3 align-top text-xs">
                                <div className="flex flex-col gap-1">
                                  <span className={`inline-flex w-fit rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${plan ? 'border-emerald-700/70 bg-emerald-950/50 text-emerald-300' : 'border-slate-700 bg-slate-800 text-slate-300'}`}>
                                    {plan ? (hasEmail ? 'email flow' : 'dm/phone flow') : 'brak playbook'}
                                  </span>
                                  {plan?.confidence && (
                                    <span className={`inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${plan.confidence === 'high' ? 'border-emerald-700/70 bg-emerald-950/50 text-emerald-300' : plan.confidence === 'medium' ? 'border-amber-700/70 bg-amber-950/50 text-amber-300' : 'border-slate-600 bg-slate-800 text-slate-300'}`}>
                                      {plan.confidence} confidence
                                    </span>
                                  )}
                                  {plan?.niche && <p className="max-w-[240px] text-[11px] text-slate-400">{plan.niche}</p>}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredLeads.length === 0 && (
                          <tr>
                            <td className="px-4 py-8 text-sm text-slate-400" colSpan={3}>Brak rekordow dla tych filtrow.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
                  {!selectedLead && <p className="text-sm text-slate-400">Wybierz leada z tabeli, aby zobaczyc gotowe wiadomosci.</p>}
                  {selectedLead && (
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-lg font-bold text-slate-100">{selectedLead.title}</h2>
                        <p className="text-xs text-slate-400">Email: {selectedLead.email || 'brak'} | Telefon: {selectedLead.phone || 'brak'}</p>
                      </div>

                      {selectedPlan && (
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-slate-300">
                            <p className="font-semibold text-slate-200">Niche</p>
                            <p className="mt-1">{selectedPlan.niche || '-'}</p>
                          </div>
                          <div className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-slate-300">
                            <p className="font-semibold text-slate-200">Confidence</p>
                            <p className="mt-1">{selectedPlan.confidence || '-'}</p>
                          </div>
                        </div>
                      )}

                      {selectedPlan?.opener_line && (
                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-slate-300">
                          <p className="font-semibold text-slate-200">Personalization opener</p>
                          <p className="mt-1">{selectedPlan.opener_line}</p>
                        </div>
                      )}

                      {selectedPlan?.quick_win && (
                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-slate-300">
                          <p className="font-semibold text-slate-200">Quick win</p>
                          <p className="mt-1">{selectedPlan.quick_win}</p>
                        </div>
                      )}

                      {selectedPlan?.research_notes && (
                        <div className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs text-slate-300">
                          <p className="font-semibold text-slate-200">Research notes</p>
                          <p className="mt-1">{selectedPlan.research_notes}</p>
                        </div>
                      )}

                      <div className="rounded-lg border border-slate-700 bg-slate-800 p-2">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">Email tone</p>
                        <div className="flex flex-wrap gap-2">
                          {(['friendly', 'premium', 'direct'] as const).map((tone) => (
                            <button
                              key={tone}
                              className={`rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${mailTone === tone ? 'border-sky-600 bg-sky-950/60 text-sky-200' : 'border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-700'}`}
                              onClick={() => setMailTone(tone)}
                            >
                              {tone}
                            </button>
                          ))}
                        </div>
                        {selectedPlan?.tone_recommendation && (
                          <p className="mt-2 text-[11px] text-slate-400">Recommended: {selectedPlan.tone_recommendation}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        {[
                          ['Subject #1', selectedPlan?.subject_1 || ''],
                          ['Subject alt', selectedPlan?.subject_alt_1 || ''],
                          [`Email #1 (${mailTone})`, firstEmailByTone || selectedPlan?.email_1 || ''],
                          ['Follow-up D+2', selectedPlan?.followup_1 || ''],
                          ['Follow-up D+5', selectedPlan?.followup_2 || ''],
                          ['Follow-up D+9', selectedPlan?.followup_3 || ''],
                          ['DM first touch', selectedPlan?.dm_1 || ''],
                          ['DM follow-up', selectedPlan?.dm_followup || ''],
                          ['Phone opening', selectedPlan?.phone_opening || ''],
                        ].map(([label, text]) => (
                          <div key={label} className="rounded-lg border border-slate-700 bg-slate-800 p-2">
                            <div className="mb-1 flex items-center justify-between gap-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{label}</p>
                              <button
                                className="inline-flex items-center gap-1 rounded-md border border-slate-600 bg-slate-900 px-2 py-1 text-[11px] font-semibold text-slate-100 hover:bg-slate-700"
                                onClick={() => copyBlock(label, String(text || ''))}
                              >
                                <Copy className="h-3.5 w-3.5" /> Copy
                              </button>
                            </div>
                            <pre className="whitespace-pre-wrap text-xs text-slate-200">{String(text || '-')}</pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'leads' && (
            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-sm">
                <div className="max-h-[700px] overflow-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 z-10 border-b border-slate-700 bg-slate-950 text-xs uppercase tracking-wide text-slate-300">
                      <tr>
                        <th className="px-3 py-3">Lead</th>
                        <th className="px-3 py-3">Kontakt</th>
                        <th className="px-3 py-3">Email status</th>
                        <th className="px-3 py-3">Workflow</th>
                        <th className="px-3 py-3">Deploy status</th>
                        <th className="px-3 py-3">Linki</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead, idx) => (
                        (() => {
                          const localTrainerUrl = buildLocalTrainerUrl(lead);
                          const localPageStatus = getLocalPageStatus(lead);
                          return (
                        <tr
                          key={lead.id}
                          className={`cursor-pointer border-t border-slate-800 transition-colors ${selectedLead?.id === lead.id ? 'bg-sky-950/40 ring-1 ring-inset ring-sky-700' : idx % 2 === 0 ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-950 hover:bg-slate-900'}`}
                          onClick={() => setSelectedLeadId(lead.id)}
                        >
                          <td className="px-3 py-3 align-top">
                            <p className="font-semibold text-slate-100">{lead.title}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{lead.slug}</p>
                          </td>
                          <td className="px-3 py-3 align-top text-xs text-slate-300">
                            <p className="truncate">{lead.email || '-'}</p>
                            <p>{lead.phone || '-'}</p>
                          </td>
                          <td className="px-3 py-3 align-top text-xs">
                            <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${emailPill(lead.emailStatus)}`}>
                              {lead.emailStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3 align-top text-xs">
                            <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-wide ${workflowPill(lead.workflowStatus)}`}>
                              {lead.workflowStatus}
                            </span>
                          </td>
                          <td className="px-3 py-3 align-top text-xs text-slate-300">
                            <div className="flex flex-col gap-1">
                              <span>{lead.deploymentStatus}</span>
                              <span className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getDeployGroup(lead) === 'new_deploy' ? 'border-sky-700 bg-sky-950/50 text-sky-300' : 'border-slate-600 bg-slate-800 text-slate-300'}`}>
                                {getDeployGroup(lead)}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-3 align-top text-xs">
                            <div className="flex flex-col gap-1">
                              {localPageStatus !== 'n_a' && (
                                <span
                                  className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                    localPageStatus === 'ready'
                                      ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
                                      : 'border-amber-700 bg-amber-950/40 text-amber-300'
                                  }`}
                                >
                                  {localPageStatus === 'ready' ? 'ready page' : 'no ready page'}
                                </span>
                              )}
                              <a className="inline-flex items-center gap-1 text-emerald-300 hover:underline" href={localTrainerUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Localhost</a>
                              {lead.vercelUrl ? <a className="inline-flex items-center gap-1 text-sky-300 hover:underline" href={lead.vercelUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Vercel</a> : <span className="text-slate-500">Brak Vercel</span>}
                              {lead.website ? <a className="inline-flex items-center gap-1 text-slate-300 hover:underline" href={lead.website} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Website</a> : <span className="text-slate-500">Brak WWW</span>}
                            </div>
                          </td>
                        </tr>
                          );
                        })()
                      ))}
                      {filteredLeads.length === 0 && <tr><td className="px-4 py-8 text-sm text-slate-400" colSpan={6}>Brak rekordow dla tych filtrow.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
                {!selectedLead && <p className="text-sm text-slate-400">Wybierz leada z tabeli, aby edytowac szczegoly.</p>}
                {selectedLead && (
                  <div className="space-y-4">
                    {(() => {
                      const localTrainerUrl = buildLocalTrainerUrl(selectedLead);
                      const localPageStatus = getLocalPageStatus(selectedLead);
                      return (
                        <>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-bold text-slate-100">{selectedLead.title}</h2>
                        <p className="text-xs text-slate-400">Ostatnia zmiana: {selectedLead.updatedAt.slice(0, 19).replace('T', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                        <UserCircle2 className="h-3.5 w-3.5" /> {selectedLead.owner || 'unassigned'}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-xs font-semibold text-slate-300">Nazwa<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.title} onChange={(event) => updateLeadField('title', event.target.value)} /></label>
                      <label className="text-xs font-semibold text-slate-300">Slug<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.slug} onChange={(event) => updateLeadField('slug', event.target.value)} /></label>
                      <label className="text-xs font-semibold text-slate-300">Email<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.email} onChange={(event) => updateLeadField('email', event.target.value)} /></label>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="text-xs font-semibold text-slate-300">Email status
                          <select className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.emailStatus} onChange={(event) => updateLeadField('emailStatus', event.target.value)}>
                            <option value="verified">verified</option>
                            <option value="risky">risky</option>
                            <option value="not_found">not_found</option>
                          </select>
                        </label>
                        <label className="text-xs font-semibold text-slate-300">Workflow
                          <select className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.workflowStatus} onChange={(event) => updateLeadField('workflowStatus', event.target.value)}>
                            {WORKFLOW_FILTERS.filter((value) => value !== 'all').map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </label>
                      </div>
                      <label className="text-xs font-semibold text-slate-300">Deploy status
                        <input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-sm font-medium text-slate-200" value={selectedLead.deploymentStatus} readOnly />
                      </label>
                      <label className="text-xs font-semibold text-slate-300">Telefon<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.phone} onChange={(event) => updateLeadField('phone', event.target.value)} /></label>
                      <label className="text-xs font-semibold text-slate-300">Website<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.website} onChange={(event) => updateLeadField('website', event.target.value)} /></label>
                      <label className="text-xs font-semibold text-slate-300">Vercel URL<input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.vercelUrl} onChange={(event) => updateLeadField('vercelUrl', event.target.value)} /></label>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="text-xs font-semibold text-slate-300">Priority
                        <select className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.priority} onChange={(event) => updateLeadField('priority', event.target.value)}>
                          <option value="low">low</option>
                          <option value="medium">medium</option>
                          <option value="high">high</option>
                        </select>
                      </label>
                      <label className="text-xs font-semibold text-slate-300">Owner
                        <input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" value={selectedLead.owner} onChange={(event) => updateLeadField('owner', event.target.value)} />
                      </label>
                    </div>

                    <label className="text-xs font-semibold text-slate-300">Tags (;)
                      <input
                        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100"
                        value={selectedLead.tags.join(';')}
                        onChange={(event) => {
                          const tags = event.target.value
                            .split(';')
                            .map((item) => item.trim())
                            .filter(Boolean);
                          if (JSON.stringify(tags) !== JSON.stringify(selectedLead.tags)) {
                            setState((prev) => ({
                              ...prev,
                              leads: prev.leads.map((lead) =>
                                lead.id === selectedLead.id ? { ...lead, tags, updatedAt: nowIso() } : lead,
                              ),
                            }));
                          }
                        }}
                      />
                    </label>

                    <label className="text-xs font-semibold text-slate-300">Next action
                      <input className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100" type="date" value={selectedLead.nextActionDate} onChange={(event) => updateLeadField('nextActionDate', event.target.value)} />
                    </label>

                    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                      <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Mail className="h-3.5 w-3.5" /> Notatki</p>
                      <div className="mb-2 flex gap-2">
                        <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-sm text-slate-100 placeholder:text-slate-500" placeholder="Dodaj notatke operacyjna" value={newNote} onChange={(event) => setNewNote(event.target.value)} />
                        <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700" onClick={addNote}>Dodaj</button>
                      </div>
                      <div className="max-h-36 space-y-2 overflow-auto">
                        {selectedLeadNotes.length === 0 && <p className="text-xs text-slate-400">Brak notatek.</p>}
                        {selectedLeadNotes.map((note) => (
                          <div key={note.id} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-slate-400">{note.createdAt.slice(0, 19).replace('T', ' ')}</span>
                              <button className="text-sky-300 hover:underline" onClick={() => togglePinned(note.id)}>{note.pinned ? 'unpinn' : 'pin'}</button>
                            </div>
                            <p className="text-slate-200">{note.pinned ? '[PINNED] ' : ''}{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                      <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500"><Activity className="h-3.5 w-3.5" /> Historia zmian</p>
                      <div className="max-h-36 space-y-2 overflow-auto">
                        {selectedLeadActivity.length === 0 && <p className="text-xs text-slate-400">Brak aktywnosci.</p>}
                        {selectedLeadActivity.map((item) => (
                          <div key={item.id} className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs">
                            <p className="font-semibold text-slate-200">{item.action}</p>
                            <p className="text-slate-300">{item.details}</p>
                            <p className="text-[11px] text-slate-400">{item.createdAt.slice(0, 19).replace('T', ' ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-700 bg-slate-800 p-2 text-[11px] text-slate-300">
                      <div className="inline-flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-emerald-300" /> approved: {metrics.verified}</div>
                      <div className="inline-flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5 text-amber-300" /> excluded: {metrics.excluded}</div>
                      <div className="inline-flex items-center gap-1"><CircleDashed className="h-3.5 w-3.5 text-rose-300" /> missing: {metrics.notFound}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <a href={selectedLead.website || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 font-semibold text-slate-200 hover:bg-slate-700">
                        <ExternalLink className="h-3.5 w-3.5" /> Open website
                      </a>
                      <a href={selectedLead.vercelUrl || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-2 font-semibold text-slate-200 hover:bg-slate-700">
                        <ExternalLink className="h-3.5 w-3.5" /> Open vercel
                      </a>
                      <a href={localTrainerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-700 bg-emerald-950/30 px-2 py-2 font-semibold text-emerald-300 hover:bg-emerald-900/40">
                        <ExternalLink className="h-3.5 w-3.5" /> Open localhost
                      </a>
                    </div>

                    {localPageStatus !== 'n_a' && (
                      <p
                        className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                          localPageStatus === 'ready'
                            ? 'border-emerald-700 bg-emerald-950/30 text-emerald-300'
                            : 'border-amber-700 bg-amber-950/30 text-amber-300'
                        }`}
                      >
                        {localPageStatus === 'ready'
                          ? 'Localhost page: READY'
                          : 'Localhost page: NOT READY (brak mapowania do gotowej strony)'}
                      </p>
                    )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </section>
            )}

            <section className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Timer className="h-3.5 w-3.5" /> Workflow snapshot</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center justify-between rounded-lg bg-slate-800 px-2 py-1 text-slate-200"><span>new/review</span><span>{projectLeads.filter((lead) => ['new', 'review'].includes(lead.workflowStatus)).length}</span></p>
                  <p className="flex items-center justify-between rounded-lg bg-sky-950/40 px-2 py-1 text-sky-300"><span>ready_to_send</span><span>{metrics.readyToSend}</span></p>
                  <p className="flex items-center justify-between rounded-lg bg-violet-950/40 px-2 py-1 text-violet-300"><span>follow_up</span><span>{projectLeads.filter((lead) => lead.workflowStatus === 'follow_up').length}</span></p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Mail className="h-3.5 w-3.5" /> Email quality</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center justify-between rounded-lg bg-emerald-950/40 px-2 py-1 text-emerald-300"><span>approved</span><span>{metrics.verified}</span></p>
                  <p className="flex items-center justify-between rounded-lg bg-amber-950/40 px-2 py-1 text-amber-300"><span>excluded</span><span>{metrics.excluded}</span></p>
                  <p className="flex items-center justify-between rounded-lg bg-rose-950/40 px-2 py-1 text-rose-300"><span>not_found</span><span>{metrics.notFound}</span></p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500"><Send className="h-3.5 w-3.5" /> Outreach readiness</p>
                <p className="text-sm text-slate-300">Leadow gotowych do wysylki (verified + risky):</p>
                <p className="mt-2 text-3xl font-black text-sky-300">{projectLeads.filter((lead) => ['verified', 'risky'].includes(lead.emailStatus)).length}</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

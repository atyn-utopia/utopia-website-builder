/**
 * Storage for per-user checklists (webcore.user_checklists). Service-role
 * reads/writes; team visibility enforced in-app.
 */

import type { CheckItem } from './checklistAI'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA ?? 'webcore'
const REST = `${SUPABASE_URL}/rest/v1`
const writeConfigured = !!(SUPABASE_URL && SERVICE_ROLE_KEY)

function svc(extra: Record<string, string> = {}) {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Accept-Profile': DB_SCHEMA,
    'Content-Profile': DB_SCHEMA,
    ...extra,
  }
}

export interface ChecklistRow {
  github_login: string
  repo_full_name: string
  source_path: string
  items: CheckItem[]
  generated_at: string
}

export async function upsertChecklist(row: Omit<ChecklistRow, 'generated_at'>): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(`${REST}/user_checklists?on_conflict=github_login`, {
      method: 'POST',
      headers: svc({ 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ ...row, generated_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    })
    return res.ok
  } catch { return false }
}

export async function listChecklists(): Promise<Omit<ChecklistRow, 'items'>[]> {
  if (!writeConfigured) return []
  try {
    const res = await fetch(
      `${REST}/user_checklists?select=github_login,repo_full_name,source_path,generated_at&order=generated_at.desc`,
      { headers: svc(), cache: 'no-store', signal: AbortSignal.timeout(6000) },
    )
    if (!res.ok) return []
    return (await res.json()) as Omit<ChecklistRow, 'items'>[]
  } catch { return [] }
}

export async function getChecklist(login: string): Promise<ChecklistRow | null> {
  if (!writeConfigured) return null
  try {
    const res = await fetch(
      `${REST}/user_checklists?select=*&github_login=eq.${encodeURIComponent(login)}&limit=1`,
      { headers: svc(), cache: 'no-store', signal: AbortSignal.timeout(6000) },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as ChecklistRow[]
    return rows[0] ?? null
  } catch { return null }
}

export async function deleteChecklist(login: string): Promise<boolean> {
  if (!writeConfigured) return false
  try {
    const res = await fetch(`${REST}/user_checklists?github_login=eq.${encodeURIComponent(login)}`, {
      method: 'DELETE',
      headers: svc({ Prefer: 'return=minimal' }),
      signal: AbortSignal.timeout(6000),
    })
    return res.ok
  } catch { return false }
}

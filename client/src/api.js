import { DEMO_PROJECT, DEMO_BLOCKS, DEMO_ALL_BLOCKS } from './mockData.js';

const BASE = '/api';

// Detecteer of de backend beschikbaar is
let _demoMode = null;
async function isDemoMode() {
  if (_demoMode !== null) return _demoMode;
  try {
    const res = await fetch(`${BASE}/blocks`, { signal: AbortSignal.timeout(2000) });
    _demoMode = !res.ok;
  } catch {
    _demoMode = true;
  }
  return _demoMode;
}

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  getBlocks: async () => {
    if (await isDemoMode()) return DEMO_ALL_BLOCKS;
    return req('GET', '/blocks');
  },

  getProjects: async () => {
    if (await isDemoMode()) return [{ ...DEMO_PROJECT, completeness: 72, block_count: 18 }];
    return req('GET', '/projects');
  },

  createProject: async (data) => {
    if (await isDemoMode()) return { ...DEMO_PROJECT, ...data, id: 99 };
    return req('POST', '/projects', data);
  },

  getProject: async (id) => {
    if (await isDemoMode()) return DEMO_PROJECT;
    return req('GET', `/projects/${id}`);
  },

  updateProject: async (id, data) => {
    if (await isDemoMode()) return { ...DEMO_PROJECT, ...data };
    return req('PUT', `/projects/${id}`, data);
  },

  deleteProject: async (id) => {
    if (await isDemoMode()) return { ok: true };
    return req('DELETE', `/projects/${id}`);
  },

  getProjectBlocks: async (id) => {
    if (await isDemoMode()) return DEMO_BLOCKS;
    return req('GET', `/projects/${id}/blocks`);
  },

  addBlock: async (id, block_id) => {
    if (await isDemoMode()) {
      const b = DEMO_ALL_BLOCKS.find(b => b.id === block_id) || {};
      return { id: Date.now(), block_id, project_id: id, sort_order: 99, fase: b.fase, domein: b.domein, activiteit: b.activiteit, inc_items: b.inc_items || [], exc_items: b.exc_items || [], variabele_velden: b.variabele_velden || [], variabele_waarden: {}, active_inc_items: [], extra_exc_items: [], variabel: b.variabel || 0 };
    }
    return req('POST', `/projects/${id}/blocks`, { block_id });
  },

  updateBlock: async (id, pbId, data) => {
    if (await isDemoMode()) return { ...DEMO_BLOCKS.find(b => b.id === pbId), ...data };
    return req('PUT', `/projects/${id}/blocks/${pbId}`, data);
  },

  removeBlock: async (id, pbId) => {
    if (await isDemoMode()) return { ok: true };
    return req('DELETE', `/projects/${id}/blocks/${pbId}`);
  },

  reorderBlocks: async (id, order) => {
    if (await isDemoMode()) return { ok: true };
    return req('POST', `/projects/${id}/blocks/reorder`, { order });
  },

  exportDocx: async (id) => {
    if (await isDemoMode()) throw new Error('Export is niet beschikbaar in demo-modus. Installeer de app lokaal om te exporteren.');
    const res = await fetch(`${BASE}/projects/${id}/export`);
    if (!res.ok) throw new Error('Export mislukt');
    const warnings = res.headers.get('X-Warnings');
    const blob = await res.blob();
    const filename = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'scope.docx';
    return { blob, filename, warnings: warnings ? JSON.parse(warnings) : [] };
  },
};

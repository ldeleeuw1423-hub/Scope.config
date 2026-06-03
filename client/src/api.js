const BASE = '/api';

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
  getBlocks: () => req('GET', '/blocks'),
  getProjects: () => req('GET', '/projects'),
  createProject: (data) => req('POST', '/projects', data),
  getProject: (id) => req('GET', `/projects/${id}`),
  updateProject: (id, data) => req('PUT', `/projects/${id}`, data),
  deleteProject: (id) => req('DELETE', `/projects/${id}`),
  getProjectBlocks: (id) => req('GET', `/projects/${id}/blocks`),
  addBlock: (id, block_id) => req('POST', `/projects/${id}/blocks`, { block_id }),
  updateBlock: (id, pbId, data) => req('PUT', `/projects/${id}/blocks/${pbId}`, data),
  removeBlock: (id, pbId) => req('DELETE', `/projects/${id}/blocks/${pbId}`),
  reorderBlocks: (id, order) => req('POST', `/projects/${id}/blocks/reorder`, { order }),
  exportDocx: async (id) => {
    const res = await fetch(`${BASE}/projects/${id}/export`);
    if (!res.ok) throw new Error('Export mislukt');
    const warnings = res.headers.get('X-Warnings');
    const blob = await res.blob();
    const filename = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'scope.docx';
    return { blob, filename, warnings: warnings ? JSON.parse(warnings) : [] };
  },
};

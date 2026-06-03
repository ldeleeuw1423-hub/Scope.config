import { useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import Library from './Library.jsx';
import Scope from './Scope.jsx';
import BlockEditPanel from './BlockEditPanel.jsx';

const STATUS_OPTIONS = [
  { value: 'concept',    label: 'Concept' },
  { value: 'definitief', label: 'Definitief' },
  { value: 'akkoord',    label: 'Akkoord' },
];

export default function ProjectCanvas({ projectId, onBack }) {
  const [project, setProject]         = useState(null);
  const [allBlocks, setAllBlocks]     = useState([]);
  const [scopeBlocks, setScopeBlocks] = useState([]);
  const [selectedPb, setSelectedPb]   = useState(null);
  const [warnings, setWarnings]       = useState([]);
  const [exporting, setExporting]     = useState(false);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProject(projectId),
      api.getBlocks(),
      api.getProjectBlocks(projectId),
    ]).then(([proj, blocks, pbs]) => {
      setProject(proj);
      setAllBlocks(blocks);
      setScopeBlocks(pbs);
    }).finally(() => setLoading(false));
  }, [projectId]);

  const addedBlockIds = new Set(scopeBlocks.map(pb => pb.block_id));

  async function addBlock(blockId) {
    const pb = await api.addBlock(projectId, blockId);
    setScopeBlocks(prev => [...prev, pb]);
  }

  async function removeBlock(pbId) {
    await api.removeBlock(projectId, pbId);
    setScopeBlocks(prev => prev.filter(pb => pb.id !== pbId));
    if (selectedPb?.id === pbId) setSelectedPb(null);
  }

  function updateBlock(updated) {
    setScopeBlocks(prev => prev.map(pb => pb.id === updated.id ? updated : pb));
    setSelectedPb(updated);
  }

  async function reorder(newOrder) {
    setScopeBlocks(newOrder);
    await api.reorderBlocks(projectId, newOrder.map((pb, i) => ({ id: pb.id, sort_order: i })));
  }

  async function updateProject(field, value) {
    const updated = { ...project, [field]: value };
    setProject(updated);
    await api.updateProject(projectId, updated);
  }

  async function doExport() {
    setExporting(true);
    setWarnings([]);
    try {
      const { blob, filename, warnings: w } = await api.exportDocx(projectId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
      if (w.length) setWarnings(w);
    } catch (e) {
      alert('Export mislukt: ' + e.message);
    } finally {
      setExporting(false);
    }
  }

  // Completeness calc
  const completeness = (() => {
    let total = 0, filled = 0;
    scopeBlocks.forEach(pb => {
      (pb.variabele_velden || []).forEach(f => {
        total++;
        if (pb.variabele_waarden?.[f]?.trim()) filled++;
      });
    });
    return total === 0 ? 100 : Math.round((filled / total) * 100);
  })();

  const completenessClass = completeness === 100 ? 'ok' : completeness >= 60 ? '' : 'warn';

  if (loading) return <div style={{ padding: 40, color: 'var(--gray)' }}>Laden…</div>;
  if (!project) return <div style={{ padding: 40, color: 'var(--danger)' }}>Project niet gevonden.</div>;

  return (
    <div className="canvas-page">
      {/* Top bar */}
      <div className="canvas-topbar">
        <span className="back-btn" onClick={onBack}>← Projecten</span>
        <span style={{ color: 'var(--border)' }}>|</span>
        <span className="project-title">{project.naam}</span>
        <div className="meta-fields">
          <span style={{ fontSize: 12, color: 'var(--gray)' }}>CL: {project.cl_nummer || '—'}</span>
          <select
            value={project.status}
            onChange={e => updateProject('status', e.target.value)}
          >
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className={`completeness-chip ${completenessClass}`}>
            {completeness}% compleet
          </span>
        </div>
        <button
          className="btn btn-success"
          onClick={doExport}
          disabled={exporting}
          style={{ marginLeft: 'auto' }}
        >
          {exporting ? '⏳ Exporteren…' : '⬇ Exporteer .docx'}
        </button>
      </div>

      {/* Three-panel body */}
      <div className="canvas-body">
        <Library
          blocks={allBlocks}
          addedIds={addedBlockIds}
          onAdd={addBlock}
        />

        <Scope
          scopeBlocks={scopeBlocks}
          selectedPbId={selectedPb?.id}
          onSelect={setSelectedPb}
          onRemove={removeBlock}
          onReorder={reorder}
        />

        {selectedPb && (
          <BlockEditPanel
            key={selectedPb.id}
            pb={selectedPb}
            projectId={projectId}
            onUpdate={updateBlock}
            onClose={() => setSelectedPb(null)}
          />
        )}
      </div>

      {/* Warnings toast */}
      {warnings.length > 0 && (
        <div className="warnings-toast">
          <span className="close" onClick={() => setWarnings([])}>✕</span>
          <h4>⚠ Lege variabelen in export:</h4>
          <ul>
            {warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { api } from '../api.js';

const STATUS_LABELS = { concept: 'Concept', definitief: 'Definitief', akkoord: 'Akkoord' };

export default function ProjectList({ onOpen }) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ naam: '', cl_nummer: '', datum: new Date().toISOString().slice(0,10), opdrachtgever: 'Liander', aannemer: 'Visser en Smit Hanab' });

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try { setProjects(await api.getProjects()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function create(e) {
    e.preventDefault();
    if (!form.naam.trim()) return;
    const p = await api.createProject(form);
    setShowModal(false);
    setForm({ naam: '', cl_nummer: '', datum: new Date().toISOString().slice(0,10), opdrachtgever: 'Liander', aannemer: 'Visser en Smit Hanab' });
    onOpen(p.id);
  }

  async function del(e, id) {
    e.stopPropagation();
    if (!confirm('Project verwijderen?')) return;
    await api.deleteProject(id);
    load();
  }

  const completenessClass = (pct) => pct === 100 ? 'ok' : pct >= 60 ? '' : 'warn';

  return (
    <div className="project-list-page">
      <div className="page-header">
        <h2>Projecten</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nieuw project</button>
      </div>

      {loading && <p style={{ color: 'var(--gray)' }}>Laden…</p>}

      {!loading && projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
          <p>Nog geen projecten. Maak er een aan.</p>
        </div>
      )}

      <div className="project-grid">
        {projects.map(p => (
          <div key={p.id} className="card project-card" onClick={() => onOpen(p.id)}>
            <div className="pc-name">{p.naam}</div>
            <div className="pc-meta">
              CL: {p.cl_nummer || '—'} &nbsp;|&nbsp; {p.datum || '—'} &nbsp;|&nbsp; {p.block_count} blokken
            </div>
            <div className="pc-footer">
              <span className={`status-badge status-${p.status}`}>{STATUS_LABELS[p.status]}</span>
              <span className={`completeness-chip ${completenessClass(p.completeness)}`}>
                {p.completeness}% compleet
              </span>
              <button className="btn-icon" title="Verwijder" onClick={(e) => del(e, p.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Nieuw project</h3>
            <form onSubmit={create}>
              <div className="form-group">
                <label>Projectnaam *</label>
                <input value={form.naam} onChange={e => setForm({...form, naam: e.target.value})} placeholder="bv. Duitslandlaan" required autoFocus />
              </div>
              <div className="form-group">
                <label>CL-nummer</label>
                <input value={form.cl_nummer} onChange={e => setForm({...form, cl_nummer: e.target.value})} placeholder="bv. 12345" />
              </div>
              <div className="form-group">
                <label>Datum</label>
                <input type="date" value={form.datum} onChange={e => setForm({...form, datum: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Opdrachtgever</label>
                <input value={form.opdrachtgever} onChange={e => setForm({...form, opdrachtgever: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Aannemer</label>
                <input value={form.aannemer} onChange={e => setForm({...form, aannemer: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuleren</button>
                <button type="submit" className="btn btn-primary">Aanmaken</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

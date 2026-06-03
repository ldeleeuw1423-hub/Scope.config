import { useState, useEffect } from 'react';
import { api } from '../api.js';

export default function BlockEditPanel({ pb, projectId, onUpdate, onClose }) {
  const [activeInc, setActiveInc] = useState(pb.active_inc_items || []);
  const [extraExc, setExtraExc] = useState(pb.extra_exc_items || []);
  const [varValues, setVarValues] = useState(pb.variabele_waarden || {});
  const [newExc, setNewExc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setActiveInc(pb.active_inc_items || []);
    setExtraExc(pb.extra_exc_items || []);
    setVarValues(pb.variabele_waarden || {});
    setNewExc('');
  }, [pb.id]);

  async function save(ai, ee, vv) {
    setSaving(true);
    try {
      const updated = await api.updateBlock(projectId, pb.id, {
        active_inc_items: ai,
        extra_exc_items: ee,
        variabele_waarden: vv,
      });
      onUpdate(updated);
    } finally {
      setSaving(false);
    }
  }

  function toggleInc(idx) {
    const next = activeInc.includes(idx)
      ? activeInc.filter(i => i !== idx)
      : [...activeInc, idx].sort((a, b) => a - b);
    setActiveInc(next);
    save(next, extraExc, varValues);
  }

  function addExc(e) {
    e.preventDefault();
    if (!newExc.trim()) return;
    const next = [...extraExc, newExc.trim()];
    setExtraExc(next);
    setNewExc('');
    save(activeInc, next, varValues);
  }

  function removeExc(i) {
    const next = extraExc.filter((_, idx) => idx !== i);
    setExtraExc(next);
    save(activeInc, next, varValues);
  }

  function setVar(field, val) {
    const next = { ...varValues, [field]: val };
    setVarValues(next);
    save(activeInc, extraExc, next);
  }

  const incItems = pb.inc_items || [];
  const excItems = pb.exc_items || [];
  const varFields = pb.variabele_velden || [];

  return (
    <div className="edit-panel">
      <div className="ep-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="ep-title">{pb.activiteit}</div>
            <div className="ep-sub">{pb.fase} · {pb.domein} {saving && '· Opslaan…'}</div>
          </div>
          <button className="btn-icon" onClick={onClose} title="Sluiten">✕</button>
        </div>
      </div>

      <div className="ep-body">
        {/* Variable fields */}
        {varFields.length > 0 && (
          <div className="ep-section">
            <div className="ep-section-label var">Variabele velden</div>
            {varFields.map(field => (
              <div className="var-field" key={field}>
                <label>{field}</label>
                <input
                  type="text"
                  value={varValues[field] || ''}
                  onChange={e => setVar(field, e.target.value)}
                  className={!varValues[field]?.trim() ? 'empty' : ''}
                  placeholder="Invullen…"
                />
                {!varValues[field]?.trim() && (
                  <div className="var-hint">⚠ Nog niet ingevuld</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Inc. items */}
        {incItems.length > 0 && (
          <div className="ep-section">
            <div className="ep-section-label inc">Inc. — Inbegrepen ({activeInc.length}/{incItems.length} actief)</div>
            {incItems.map((item, idx) => (
              <div
                key={idx}
                className={`inc-item ${!activeInc.includes(idx) ? 'disabled' : ''}`}
                onClick={() => toggleInc(idx)}
              >
                <input
                  type="checkbox"
                  checked={activeInc.includes(idx)}
                  onChange={() => toggleInc(idx)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="ii-text">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Exc. items */}
        <div className="ep-section">
          <div className="ep-section-label exc">Exc. — Buiten scope</div>
          {excItems.map((item, idx) => (
            <div className="exc-item" key={idx}>
              <span className="ii-text" style={{ flex: 1 }}>{item}</span>
            </div>
          ))}
          {extraExc.map((item, idx) => (
            <div className="exc-item" key={`extra-${idx}`} style={{ background: '#FFF1F2', borderColor: '#FECDD3' }}>
              <span className="ii-text" style={{ flex: 1 }}>{item}</span>
              <button className="btn-icon btn-sm" onClick={() => removeExc(idx)} title="Verwijder">✕</button>
            </div>
          ))}
          <form className="add-exc-row" onSubmit={addExc}>
            <input
              value={newExc}
              onChange={e => setNewExc(e.target.value)}
              placeholder="Extra exc.-punt toevoegen…"
            />
            <button type="submit" className="btn btn-sm" style={{ background: 'var(--exc-brown)', color: '#fff' }}>+</button>
          </form>
        </div>
      </div>
    </div>
  );
}

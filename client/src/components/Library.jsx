import { useState, useMemo } from 'react';

const FASES = ['PREP', 'VO', 'DO', 'UO', 'NAO'];
const DOMAINS = ['TM', 'OM', 'CO', 'PB', 'PM'];
const DOMAIN_LABELS = { TM: 'Technisch Management', OM: 'Omgevingsmanagement', CO: 'Conditionerende Onderzoeken', PB: 'Projectbeheersing', PM: 'Projectmanagement' };

export default function Library({ blocks, addedIds, onAdd }) {
  const [search, setSearch] = useState('');
  const [faseFilter, setFaseFilter] = useState(null);
  const [domainFilter, setDomainFilter] = useState(null);

  const filtered = useMemo(() => {
    let b = blocks;
    if (faseFilter) b = b.filter(x => x.fase === faseFilter);
    if (domainFilter) b = b.filter(x => x.domein === domainFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      b = b.filter(x => x.activiteit.toLowerCase().includes(q) || x.id.toLowerCase().includes(q));
    }
    return b;
  }, [blocks, search, faseFilter, domainFilter]);

  // Group by fase → domein
  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(b => {
      if (!g[b.fase]) g[b.fase] = {};
      if (!g[b.fase][b.domein]) g[b.fase][b.domein] = [];
      g[b.fase][b.domein].push(b);
    });
    return g;
  }, [filtered]);

  return (
    <div className="library-panel">
      <div className="lib-header">
        <h3>Bibliotheek ({blocks.length} blokken)</h3>
        <input
          className="lib-search"
          placeholder="Zoeken…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="lib-filters">
          {FASES.map(f => (
            <button
              key={f}
              className={`lib-filter-btn ${faseFilter === f ? 'active' : ''}`}
              onClick={() => setFaseFilter(faseFilter === f ? null : f)}
            >{f}</button>
          ))}
        </div>
        <div className="lib-filters" style={{ marginTop: 4 }}>
          {DOMAINS.map(d => (
            <button
              key={d}
              className={`lib-filter-btn ${domainFilter === d ? 'active' : ''}`}
              onClick={() => setDomainFilter(domainFilter === d ? null : d)}
            >{d}</button>
          ))}
        </div>
      </div>

      <div className="library-list">
        {Object.keys(grouped).sort((a, b) => FASES.indexOf(a) - FASES.indexOf(b)).map(fase => (
          <div className="lib-phase-group" key={fase}>
            <div className="lib-phase-label">{fase}</div>
            {Object.keys(grouped[fase]).sort((a, b) => DOMAINS.indexOf(a) - DOMAINS.indexOf(b)).map(domein => (
              <div key={domein}>
                <div className="lib-domein-label">{domein} — {DOMAIN_LABELS[domein]}</div>
                {grouped[fase][domein].map(block => {
                  const added = addedIds.has(block.id);
                  return (
                    <div
                      key={block.id}
                      className={`lib-block ${added ? 'already-added' : ''}`}
                      onClick={() => !added && onAdd(block.id)}
                      title={added ? 'Al toegevoegd' : `Toevoegen: ${block.activiteit}`}
                    >
                      <span className={`lb-domain-dot dom-${block.domein}`} />
                      <span className="lb-name">{block.activiteit}</span>
                      {!added
                        ? <span style={{ fontSize: 16, color: 'var(--mid-blue)', fontWeight: 700 }}>+</span>
                        : <span style={{ fontSize: 12, color: 'var(--inc-green)' }}>✓</span>
                      }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ padding: '20px 14px', color: 'var(--gray)', fontSize: 12 }}>Geen blokken gevonden.</p>
        )}
      </div>
    </div>
  );
}

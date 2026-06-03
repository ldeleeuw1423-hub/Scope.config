import { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList.jsx';
import ProjectCanvas from './components/ProjectCanvas.jsx';

export default function App() {
  const [projectId, setProjectId] = useState(null);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    fetch('/api/blocks', { signal: AbortSignal.timeout(2000) })
      .then(r => { if (!r.ok) setDemoMode(true); })
      .catch(() => setDemoMode(true));
  }, []);

  return (
    <div>
      <header className="app-header">
        <span style={{ fontSize: 20 }}>⚡</span>
        <h1>Scope Configurator</h1>
        <span className="badge">NuRijnland</span>
        {demoMode && (
          <span style={{
            background: '#FEF3C7', color: '#92400E',
            fontSize: 11, fontWeight: 700, padding: '2px 10px',
            borderRadius: 20, marginLeft: 8,
          }}>
            DEMO — alleen lezen
          </span>
        )}
        {projectId && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setProjectId(null)}>
            ← Terug naar projecten
          </button>
        )}
      </header>

      {demoMode && (
        <div style={{
          background: '#FFFBEB', borderBottom: '1px solid #FDE68A',
          padding: '8px 20px', fontSize: 12, color: '#92400E',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>ℹ️</span>
          <span>
            <strong>Demo-modus:</strong> je bekijkt voorbeeldproject "Duitslandlaan".
            Wijzigingen worden niet opgeslagen en .docx-export is niet beschikbaar.
            Installeer de app lokaal voor volledig gebruik — zie <strong>INSTALLATIE.md</strong>.
          </span>
        </div>
      )}

      {projectId
        ? <ProjectCanvas projectId={projectId} onBack={() => setProjectId(null)} demoMode={demoMode} />
        : <ProjectList onOpen={setProjectId} demoMode={demoMode} />
      }
    </div>
  );
}

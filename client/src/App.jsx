import { useState } from 'react';
import ProjectList from './components/ProjectList.jsx';
import ProjectCanvas from './components/ProjectCanvas.jsx';

export default function App() {
  const [projectId, setProjectId] = useState(null);

  return (
    <div>
      <header className="app-header">
        <span style={{ fontSize: 20 }}>⚡</span>
        <h1>Scope Configurator</h1>
        <span className="badge">NuRijnland</span>
        {projectId && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setProjectId(null)}>
            ← Terug naar projecten
          </button>
        )}
      </header>
      {projectId
        ? <ProjectCanvas projectId={projectId} onBack={() => setProjectId(null)} />
        : <ProjectList onOpen={setProjectId} />
      }
    </div>
  );
}

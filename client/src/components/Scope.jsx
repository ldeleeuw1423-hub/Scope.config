import { useMemo } from 'react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const FASES = ['PREP', 'VO', 'DO', 'UO', 'NAO'];
const DOMAINS = ['TM', 'OM', 'CO', 'PB', 'PM'];
const DOMAIN_LABELS = { TM: 'Technisch Management', OM: 'Omgevingsmanagement', CO: 'Conditionerende Onderzoeken', PB: 'Projectbeheersing', PM: 'Projectmanagement' };

function SortableBlock({ pb, isSelected, onSelect, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pb.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? .5 : 1,
  };

  const activeInc = pb.active_inc_items || [];
  const totalInc = (pb.inc_items || []).length;
  const varFields = pb.variabele_velden || [];
  const varVals = pb.variabele_waarden || {};
  const emptyVars = varFields.filter(f => !varVals[f]?.trim()).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`scope-block ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(pb)}
    >
      <span className="drag-handle" {...attributes} {...listeners} onClick={e => e.stopPropagation()}>⠿</span>
      <div className="sb-main">
        <div className="sb-title">{pb.activiteit}</div>
        <div className="sb-summary">
          <span className="inc-count">{activeInc.length}/{totalInc} Inc.</span>
          {emptyVars > 0 && <span className="warn-count"> · ⚠ {emptyVars} veld{emptyVars > 1 ? 'en' : ''} leeg</span>}
        </div>
      </div>
      <div className="sb-actions">
        <button
          className="btn-icon"
          title="Verwijder uit scope"
          onClick={e => { e.stopPropagation(); onRemove(pb.id); }}
        >🗑</button>
      </div>
    </div>
  );
}

export default function Scope({ scopeBlocks, selectedPbId, onSelect, onRemove, onReorder }) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Group by fase → domein
  const grouped = useMemo(() => {
    const g = {};
    scopeBlocks.forEach(pb => {
      if (!g[pb.fase]) g[pb.fase] = {};
      if (!g[pb.fase][pb.domein]) g[pb.fase][pb.domein] = [];
      g[pb.fase][pb.domein].push(pb);
    });
    return g;
  }, [scopeBlocks]);

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIdx = scopeBlocks.findIndex(pb => pb.id === active.id);
    const newIdx = scopeBlocks.findIndex(pb => pb.id === over.id);
    if (oldIdx !== -1 && newIdx !== -1) {
      onReorder(arrayMove(scopeBlocks, oldIdx, newIdx));
    }
  }

  if (scopeBlocks.length === 0) {
    return (
      <div className="scope-panel">
        <h3>Projectscope</h3>
        <div className="scope-empty">
          <div className="icon">📋</div>
          <p>Voeg bouwblokken toe via de bibliotheek links.</p>
        </div>
      </div>
    );
  }

  const activeBlock = activeId ? scopeBlocks.find(pb => pb.id === activeId) : null;

  return (
    <div className="scope-panel">
      <h3>Projectscope ({scopeBlocks.length} blokken)</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={e => setActiveId(e.active.id)}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={scopeBlocks.map(pb => pb.id)} strategy={verticalListSortingStrategy}>
          {FASES.filter(f => grouped[f]).map(fase => {
            const domains = grouped[fase];
            // Completeness for this fase
            let total = 0, filled = 0;
            Object.values(domains).flat().forEach(pb => {
              (pb.variabele_velden || []).forEach(f => {
                total++;
                if (pb.variabele_waarden?.[f]?.trim()) filled++;
              });
            });
            const pct = total === 0 ? 100 : Math.round((filled / total) * 100);

            return (
              <div className="scope-phase-section" key={fase}>
                <div className="scope-phase-header">
                  <span>{fase}</span>
                  <span className="phase-complete">{pct}% compleet</span>
                </div>
                {DOMAINS.filter(d => domains[d]).map(domein => (
                  <div className="scope-domein-section" key={domein}>
                    <div className="scope-domein-header">
                      {domein} — {DOMAIN_LABELS[domein]}
                    </div>
                    {domains[domein].map(pb => (
                      <SortableBlock
                        key={pb.id}
                        pb={pb}
                        isSelected={selectedPbId === pb.id}
                        onSelect={onSelect}
                        onRemove={onRemove}
                      />
                    ))}
                  </div>
                ))}
              </div>
            );
          })}
        </SortableContext>
        <DragOverlay>
          {activeBlock && (
            <div className="scope-block" style={{ background: '#fff', boxShadow: 'var(--shadow-lg)', opacity: .9 }}>
              <span className="drag-handle">⠿</span>
              <div className="sb-main">
                <div className="sb-title">{activeBlock.activiteit}</div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

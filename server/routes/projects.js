const express = require('express');
const db = require('../db');
const { generateDocx } = require('../export');
const router = express.Router();

// ── Projects CRUD ─────────────────────────────────────────────────────────────

router.get('/', (req, res) => {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();

  // Completeness: count variable fields filled per project
  projects.forEach(p => {
    const pbs = db.prepare('SELECT pb.*, b.variabele_velden FROM project_blocks pb JOIN blocks b ON pb.block_id = b.id WHERE pb.project_id = ?').all(p.id);
    let total = 0, filled = 0;
    pbs.forEach(pb => {
      const fields = JSON.parse(pb.variabele_velden || '[]');
      const vals = JSON.parse(pb.variabele_waarden || '{}');
      fields.forEach(f => {
        total++;
        if (vals[f] && vals[f].trim()) filled++;
      });
    });
    p.completeness = total === 0 ? 100 : Math.round((filled / total) * 100);
    p.block_count = pbs.length;
  });

  res.json(projects);
});

router.post('/', (req, res) => {
  const { naam, cl_nummer, datum, opdrachtgever, aannemer } = req.body;
  if (!naam) return res.status(400).json({ error: 'naam is verplicht' });
  const result = db.prepare(
    'INSERT INTO projects (naam, cl_nummer, datum, opdrachtgever, aannemer) VALUES (?, ?, ?, ?, ?)'
  ).run(naam, cl_nummer || null, datum || null, opdrachtgever || 'Liander', aannemer || 'Visser en Smit Hanab');
  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid));
});

router.get('/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Niet gevonden' });
  res.json(project);
});

router.put('/:id', (req, res) => {
  const { naam, cl_nummer, datum, opdrachtgever, aannemer, status } = req.body;
  db.prepare(
    'UPDATE projects SET naam=?, cl_nummer=?, datum=?, opdrachtgever=?, aannemer=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(naam, cl_nummer, datum, opdrachtgever, aannemer, status, req.params.id);
  res.json(db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── Project blocks ────────────────────────────────────────────────────────────

router.get('/:id/blocks', (req, res) => {
  const rows = db.prepare(`
    SELECT pb.*, b.fase, b.domein, b.activiteit, b.inc_items, b.exc_items, b.variabel, b.variabele_velden
    FROM project_blocks pb
    JOIN blocks b ON pb.block_id = b.id
    WHERE pb.project_id = ?
    ORDER BY pb.sort_order
  `).all(req.params.id);

  rows.forEach(r => {
    r.inc_items = JSON.parse(r.inc_items);
    r.exc_items = JSON.parse(r.exc_items);
    r.variabele_velden = JSON.parse(r.variabele_velden || '[]');
    r.active_inc_items = JSON.parse(r.active_inc_items || '[]');
    r.extra_exc_items = JSON.parse(r.extra_exc_items || '[]');
    r.variabele_waarden = JSON.parse(r.variabele_waarden || '{}');
  });

  res.json(rows);
});

router.post('/:id/blocks', (req, res) => {
  const { block_id } = req.body;
  if (!block_id) return res.status(400).json({ error: 'block_id vereist' });

  const block = db.prepare('SELECT * FROM blocks WHERE id = ?').get(block_id);
  if (!block) return res.status(404).json({ error: 'Blok niet gevonden' });

  // Default: all inc items active
  const incItems = JSON.parse(block.inc_items);
  const activeInc = incItems.map((_, i) => i);

  const maxOrder = db.prepare('SELECT MAX(sort_order) as m FROM project_blocks WHERE project_id = ?').get(req.params.id);
  const sort_order = (maxOrder?.m ?? -1) + 1;

  const result = db.prepare(
    'INSERT INTO project_blocks (project_id, block_id, sort_order, active_inc_items) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, block_id, sort_order, JSON.stringify(activeInc));

  const row = db.prepare(`
    SELECT pb.*, b.fase, b.domein, b.activiteit, b.inc_items, b.exc_items, b.variabel, b.variabele_velden
    FROM project_blocks pb JOIN blocks b ON pb.block_id = b.id WHERE pb.id = ?
  `).get(result.lastInsertRowid);

  row.inc_items = JSON.parse(row.inc_items);
  row.exc_items = JSON.parse(row.exc_items);
  row.variabele_velden = JSON.parse(row.variabele_velden || '[]');
  row.active_inc_items = JSON.parse(row.active_inc_items || '[]');
  row.extra_exc_items = JSON.parse(row.extra_exc_items || '[]');
  row.variabele_waarden = JSON.parse(row.variabele_waarden || '{}');

  res.json(row);
});

router.put('/:id/blocks/:pbId', (req, res) => {
  const { active_inc_items, extra_exc_items, variabele_waarden } = req.body;
  db.prepare(
    'UPDATE project_blocks SET active_inc_items=?, extra_exc_items=?, variabele_waarden=? WHERE id=? AND project_id=?'
  ).run(
    JSON.stringify(active_inc_items),
    JSON.stringify(extra_exc_items || []),
    JSON.stringify(variabele_waarden || {}),
    req.params.pbId,
    req.params.id
  );

  const row = db.prepare(`
    SELECT pb.*, b.fase, b.domein, b.activiteit, b.inc_items, b.exc_items, b.variabel, b.variabele_velden
    FROM project_blocks pb JOIN blocks b ON pb.block_id = b.id WHERE pb.id = ?
  `).get(req.params.pbId);

  row.inc_items = JSON.parse(row.inc_items);
  row.exc_items = JSON.parse(row.exc_items);
  row.variabele_velden = JSON.parse(row.variabele_velden || '[]');
  row.active_inc_items = JSON.parse(row.active_inc_items || '[]');
  row.extra_exc_items = JSON.parse(row.extra_exc_items || '[]');
  row.variabele_waarden = JSON.parse(row.variabele_waarden || '{}');

  res.json(row);
});

router.delete('/:id/blocks/:pbId', (req, res) => {
  db.prepare('DELETE FROM project_blocks WHERE id = ? AND project_id = ?').run(req.params.pbId, req.params.id);
  res.json({ ok: true });
});

router.post('/:id/blocks/reorder', (req, res) => {
  const { order } = req.body; // array of { id, sort_order }
  const update = db.prepare('UPDATE project_blocks SET sort_order=? WHERE id=? AND project_id=?');
  const tx = db.transaction(() => {
    order.forEach(({ id, sort_order }) => update.run(sort_order, id, req.params.id));
  });
  tx();
  res.json({ ok: true });
});

// ── Export ───────────────────────────────────────────────────────────────────

router.get('/:id/export', async (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Niet gevonden' });

  const pbs = db.prepare('SELECT * FROM project_blocks WHERE project_id = ? ORDER BY sort_order').all(req.params.id);
  const blockIds = [...new Set(pbs.map(pb => pb.block_id))];
  const blocks = db.prepare(`SELECT * FROM blocks WHERE id IN (${blockIds.map(() => '?').join(',')})`)
    .all(...blockIds);
  const blockMap = {};
  blocks.forEach(b => { blockMap[b.id] = b; });

  try {
    const warnings = [];
    pbs.forEach(pb => {
      const b = blockMap[pb.block_id];
      if (!b) return;
      const fields = JSON.parse(b.variabele_velden || '[]');
      const vals = JSON.parse(pb.variabele_waarden || '{}');
      fields.forEach(f => {
        if (!vals[f] || !vals[f].trim()) warnings.push(`${b.activiteit}: ${f}`);
      });
    });

    const buffer = await generateDocx(project, pbs, blockMap);
    const filename = `Scope_${project.naam.replace(/\s+/g, '_')}_${project.cl_nummer || 'concept'}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    if (warnings.length) {
      res.setHeader('X-Warnings', JSON.stringify(warnings));
    }
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

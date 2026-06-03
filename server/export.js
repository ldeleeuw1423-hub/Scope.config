const {
  Document, Paragraph, Table, TableRow, TableCell, TextRun,
  Packer, AlignmentType, VerticalAlign, WidthType, BorderStyle,
  HeightRule, ShadingType, convertInchesToTwip,
} = require('docx');

// ── Colour constants (no # prefix for docx) ─────────────────────────────────
const C = {
  PHASE_BG:    '0D2137',  // fase-header achtergrond
  DARK_BLUE:   '1F3864',  // kolomkop / fase+domein tekst
  MID_BLUE:    '2E5A8C',  // sectieheader
  LIGHT_BLUE:  '4472C4',  // subsectierij
  INC_GREEN:   '375623',
  EXC_BROWN:   '843C0C',
  GRAY:        '595959',
  ZEBRA:       'EBF2FA',
  WHITE:       'FFFFFF',
  BLACK:       '000000',
};

const FONT = 'Arial';

// DXA values
const PAGE_W  = 11906;
const PAGE_H  = 16838;
const MARGIN  = 1134;
const TBL_W   = 9638;
const COL_FASE    =  900;
const COL_DOMEIN  =  800;
const COL_ACT     = 3538;
const COL_INEX    = 4400;

// ── Helpers ──────────────────────────────────────────────────────────────────

function shade(hex) {
  return { type: ShadingType.CLEAR, color: 'auto', fill: hex };
}

function borderSet(sz, color) {
  const b = { style: BorderStyle.SINGLE, size: sz, color };
  return { top: b, bottom: b, left: b, right: b };
}

function cell(children, opts = {}) {
  return new TableCell({
    children,
    shading: opts.bg ? shade(opts.bg) : undefined,
    borders: borderSet(opts.borderSz || 4, 'auto'),
    verticalAlign: VerticalAlign.CENTER,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    columnSpan: opts.span,
  });
}

function para(runs, align) {
  return new Paragraph({ children: runs, alignment: align });
}

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: (opts.pt || 8) * 2,
    bold: opts.bold || false,
    italics: opts.italic || false,
    color: opts.color || C.BLACK,
  });
}

// ── Row builders ─────────────────────────────────────────────────────────────

function phaseHeaderRow(label) {
  return new TableRow({
    children: [
      cell([para([run(label, { bold: true, color: C.WHITE, pt: 10 })])], {
        bg: C.PHASE_BG, span: 4, borderSz: 6,
      }),
    ],
    height: { value: 360, rule: HeightRule.ATLEAST },
  });
}

function columnHeaderRow() {
  const heads = ['Fase', 'Domein', 'Activiteit', 'Inc. / Exc.'];
  const widths = [COL_FASE, COL_DOMEIN, COL_ACT, COL_INEX];
  return new TableRow({
    children: heads.map((h, i) =>
      cell([para([run(h, { bold: true, color: C.WHITE, pt: 8 })])], {
        bg: C.DARK_BLUE, width: widths[i],
      })
    ),
    height: { value: 320, rule: HeightRule.ATLEAST },
  });
}

function sectionHeaderRow(label) {
  return new TableRow({
    children: [
      cell([para([run(label, { bold: true, color: C.WHITE, pt: 9 })])], {
        bg: C.MID_BLUE, span: 4,
      }),
    ],
    height: { value: 340, rule: HeightRule.ATLEAST },
  });
}

function subsectionRow(label) {
  return new TableRow({
    children: [
      cell([para([run(label, { bold: true, color: C.WHITE, pt: 8 })])], {
        bg: C.LIGHT_BLUE, span: 4,
      }),
    ],
    height: { value: 300, rule: HeightRule.ATLEAST },
  });
}

function activityRow(pb, block, rowIndex) {
  const bg = rowIndex % 2 === 0 ? C.ZEBRA : undefined;

  // Build Inc./Exc. paragraph with inline runs
  const activeIncIndices = JSON.parse(pb.active_inc_items || '[]');
  const extraExc = JSON.parse(pb.extra_exc_items || '[]');
  const varValues = JSON.parse(pb.variabele_waarden || '{}');
  const incItems = JSON.parse(block.inc_items || '[]');
  const excItems = JSON.parse(block.exc_items || '[]');

  const inExRuns = [];
  let hasContent = false;

  // Inc. items
  const activeIncs = incItems.filter((_, i) => activeIncIndices.includes(i));
  activeIncs.forEach((item, idx) => {
    // Replace variable placeholders with actual values
    let text = item;
    if (block.variabele_velden) {
      const fields = JSON.parse(block.variabele_velden);
      fields.forEach(f => {
        const val = varValues[f];
        if (val) {
          text = text.replace(/_____/, val).replace(new RegExp(`\\[invullen per project\\]`), '');
        }
      });
    }
    if (idx > 0 || hasContent) inExRuns.push(run('  |  ', { color: C.GRAY, pt: 8 }));
    inExRuns.push(run('Inc. ', { bold: true, color: C.INC_GREEN, pt: 8 }));
    inExRuns.push(run(text.trim(), { color: C.BLACK, pt: 8 }));
    hasContent = true;
  });

  // Exc. items
  const allExc = [...excItems, ...extraExc];
  allExc.forEach(item => {
    if (hasContent) inExRuns.push(run('  |  ', { color: C.GRAY, pt: 8 }));
    inExRuns.push(run('Exc. ', { bold: true, color: C.EXC_BROWN, pt: 8 }));
    inExRuns.push(run(item.trim(), { italic: true, color: C.GRAY, pt: 8 }));
    hasContent = true;
  });

  if (!hasContent) {
    inExRuns.push(run('—', { color: C.GRAY, pt: 8 }));
  }

  return new TableRow({
    children: [
      cell([para([run(block.fase, { bold: true, color: C.DARK_BLUE, pt: 8 })])], { bg, width: COL_FASE }),
      cell([para([run(block.domein, { bold: true, color: C.DARK_BLUE, pt: 8 })])], { bg, width: COL_DOMEIN }),
      cell([para([run(block.activiteit, { bold: true, pt: 8 })])], { bg, width: COL_ACT }),
      cell([para(inExRuns)], { bg, width: COL_INEX }),
    ],
    height: { value: 300, rule: HeightRule.ATLEAST },
  });
}

// ── Main export function ─────────────────────────────────────────────────────

async function generateDocx(project, projectBlocks, blockMap) {
  const rows = [];

  // Group project blocks by fase → domein
  const byFase = {};
  projectBlocks.forEach(pb => {
    const b = blockMap[pb.block_id];
    if (!b) return;
    if (!byFase[b.fase]) byFase[b.fase] = {};
    if (!byFase[b.fase][b.domein]) byFase[b.fase][b.domein] = [];
    byFase[b.fase][b.domein].push({ pb, b });
  });

  const faseOrder = ['PREP', 'VO', 'DO', 'UO', 'NAO'];
  const domainLabel = { TM: 'Technisch Management', OM: 'Omgevingsmanagement', CO: 'Conditionerende Onderzoeken', PB: 'Projectbeheersing', PM: 'Projectmanagement' };

  let globalRowIndex = 0;

  for (const fase of faseOrder) {
    if (!byFase[fase]) continue;

    rows.push(phaseHeaderRow(fase));
    rows.push(columnHeaderRow());

    const domains = byFase[fase];
    for (const domein of Object.keys(domains).sort()) {
      const label = domainLabel[domein] || domein;
      rows.push(sectionHeaderRow(`${fase} — ${label}`));

      domains[domein].forEach(({ pb, b }) => {
        rows.push(activityRow(pb, b, globalRowIndex++));
      });
    }
  }

  const table = new Table({
    rows,
    width: { size: TBL_W, type: WidthType.DXA },
    borders: borderSet(4, 'auto'),
  });

  const datum = project.datum || new Date().toLocaleDateString('nl-NL');

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      children: [
        // Header regel 1
        new Paragraph({
          children: [
            new TextRun({
              text: 'SCOPE AFBAKENING — ACTIVITEITEN A–Z  |  Inc. / Exc. per activiteit',
              font: FONT, size: 26, bold: true, color: C.DARK_BLUE,
            }),
          ],
          spacing: { after: 60 },
        }),
        // Header regel 2
        new Paragraph({
          children: [
            new TextRun({
              text: `Project: ${project.naam}  |  CL: ${project.cl_nummer || '—'}  |  Aannemer: ${project.aannemer || 'Visser en Smit Hanab'}  |  Datum: ${datum}`,
              font: FONT, size: 18, color: C.GRAY,
            }),
          ],
          spacing: { after: 60 },
        }),
        // Header regel 3: legenda
        new Paragraph({
          children: [
            new TextRun({ text: 'Inc.', font: FONT, size: 16, bold: true, color: C.INC_GREEN }),
            new TextRun({ text: ' = inbegrepen  |  ', font: FONT, size: 16, color: C.GRAY }),
            new TextRun({ text: 'Exc.', font: FONT, size: 16, bold: true, color: C.EXC_BROWN }),
            new TextRun({ text: ' = buiten scope  |  Prijzen worden nooit opgenomen', font: FONT, size: 16, color: C.GRAY }),
          ],
          spacing: { after: 160 },
        }),
        table,
      ],
    }],
  });

  return Packer.toBuffer(doc);
}

module.exports = { generateDocx };

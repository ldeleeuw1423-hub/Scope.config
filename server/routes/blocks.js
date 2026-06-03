const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const blocks = db.prepare('SELECT * FROM blocks ORDER BY sort_order').all();
  blocks.forEach(b => {
    b.inc_items = JSON.parse(b.inc_items);
    b.exc_items = JSON.parse(b.exc_items);
    b.variabele_velden = JSON.parse(b.variabele_velden || '[]');
  });
  res.json(blocks);
});

module.exports = router;

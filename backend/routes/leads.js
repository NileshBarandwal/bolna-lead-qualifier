const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');
const { triggerOutboundCall } = require('../services/bolna');

// POST /api/leads — submit a new lead
router.post('/', async (req, res) => {
  const { name, email, phone, company, use_case } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name, email, and phone are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const db = getDb();
    const now = new Date().toISOString();

    const result = db.prepare(
      `INSERT INTO leads (name, email, phone, company, use_case, call_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
    ).run(name, email, phone, company || null, use_case || null, now, now);

    const leadId = result.lastInsertRowid;

    db.prepare(
      `UPDATE leads SET call_status = 'in_progress', updated_at = ? WHERE id = ?`
    ).run(new Date().toISOString(), leadId);

    const callId = await triggerOutboundCall({ id: leadId, name, email, phone, company });

    db.prepare(
      `UPDATE leads SET call_id = ?, updated_at = ? WHERE id = ?`
    ).run(callId, new Date().toISOString(), leadId);

    return res.status(201).json({
      id: leadId,
      call_id: callId,
      message: 'Lead saved and call initiated',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process lead submission' });
  }
});

// GET /api/leads — fetch all leads
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const leads = db.prepare(
      `SELECT id, name, email, phone, company, use_case, call_id, call_status, qualification, transcript, created_at, updated_at
       FROM leads
       ORDER BY created_at DESC`
    ).all();

    return res.status(200).json(leads);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/leads/:id — fetch single lead with transcript
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({ error: 'Invalid lead ID' });
  }

  try {
    const db = getDb();
    const lead = db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

module.exports = router;

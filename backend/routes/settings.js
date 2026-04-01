const express = require('express');
const { run, get, all } = require('../database');

const router = express.Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await all('SELECT * FROM settings');
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await get('SELECT * FROM settings WHERE key = ?', [req.params.key]);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update setting
router.put('/:key', async (req, res) => {
  try {
    const { value } = req.body;
    await run(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      [req.params.key, value]
    );
    res.json({ key: req.params.key, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update multiple settings
router.put('/', async (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await run(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        [key, String(value)]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

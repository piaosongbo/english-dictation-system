const express = require('express');
const { getAllSettings, getSetting, setSetting } = require('../database');

const router = express.Router();

// Get all settings
router.get('/', (req, res) => {
  try {
    const settings = getAllSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single setting
router.get('/:key', (req, res) => {
  try {
    const value = getSetting(req.params.key);
    if (value === undefined) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ key: req.params.key, value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update setting
router.put('/:key', (req, res) => {
  try {
    const { value } = req.body;
    setSetting(req.params.key, String(value));
    res.json({ key: req.params.key, value: String(value) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update multiple settings
router.put('/', (req, res) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      setSetting(key, String(value));
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

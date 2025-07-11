const express = require("express");
const LocalizedMessage = require("../models/LocalizedMessage");
const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
  const messages = await LocalizedMessage.findAll();
  res.json(messages);
});

// Get message by ID
router.get("/:id", async (req, res) => {
  const message = await LocalizedMessage.findByPk(req.params.id);
  message ? res.json(message) : res.status(404).send("Not found");
});

// Get message by key and language
router.get("/key/:key/:language", async (req, res) => {
  const { key, language } = req.params;
  const message = await LocalizedMessage.findOne({ where: { key, language } });
  message ? res.json(message) : res.status(404).send("Not found");
});

// Create new message
router.post("/", async (req, res) => {
  const { key, value, language } = req.body;
  try {
    const message = await LocalizedMessage.create({ key, value, language });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update message by ID
router.put("/:id", async (req, res) => {
  const { value, language } = req.body;
  const message = await LocalizedMessage.findByPk(req.params.id);
  if (!message) return res.status(404).send("Not found");

  message.value = value || message.value;
  message.language = language || message.language;
  await message.save();
  res.json(message);
});

// Delete message by ID
router.delete("/:id", async (req, res) => {
  const deleted = await LocalizedMessage.destroy({ where: { id: req.params.id } });
  res.status(deleted ? 204 : 404).send();
});
module.exports = router;
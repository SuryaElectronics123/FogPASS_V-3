const express = require("express");
const LocalizedMessage = require("../models/LocalizedMessage");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const { v4: uuidv4 } = require("uuid");

// Get all messages
router.get("/", async (req, res) => {
  const messages = await LocalizedMessage.findAll();
  res.json(messages);
});

router.get("/download-template", async (req, res) => {
  // Define sample data
  const data = [
    { key: "greeting", message: "Hello" },
    { key: "greeting", message: "नमस्ते" }
  ];

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "LocalizedMessages");

  // Write workbook to buffer
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx"
  });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=LocalizedMessagesTemplate.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
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
  let lang
  try {
    if (!language || language.trim() === "") {
      const langCode = detectLanguage(value);
      if (langCode !== "und") {
        lang = langCode
      } else {
        lang = "en";
      }
    }
    const message = await LocalizedMessage.create({ key, value, language: lang });
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

// File upload setup
const upload = multer({ storage: multer.memoryStorage() });

// 🔄 POST /localizedMessages/upload
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const imported = [];
    const errored = [];

    for (const row of data) {
      let { key, message, language } = row;
      if (!key || !message) continue;

      // Detect language if missing
      if (!language || language.trim() === "") {
        const langCode = detectLanguage(message);
        if (langCode !== "und") {
          language = langCode
        } else {
          language = "en";
        }
      }

      try {
        await LocalizedMessage.upsert({
          id: uuidv4(),
          key,
          value: message,
          language
        });
        imported.push({ key, language, value: message });
      } catch (err) {
        errored.push({ key, language, value: message, message: `A message with key ${key} already exists` });
      }
    }

    res.json({ importedCount: imported.length, erroredCount: errored.length, imported, errored });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function detectLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return 'hi';  // Hindi (Devanagari)
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';  // Telugu
  if (/^[a-zA-Z\s]+$/.test(text)) return 'en';    // English (basic Latin)
  return 'und'; // Undetermined
}

module.exports = router;
const express = require('express');
const TripSignalDetails = require('../models/tripSignalDetails');
const router = express.Router();

// ✅ Create a new Trip Signal Detail
router.post('/', async (req, res) => {
    try {
        const signalDetail = await TripSignalDetails.create(req.body);
        res.status(201).json(signalDetail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get all Trip Signal Details
router.get('/', async (req, res) => {
    try {
        const signals = await TripSignalDetails.findAll();
        res.json(signals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get a specific Trip Signal Detail by ID
router.get('/:id', async (req, res) => {
    try {
        const signalDetail = await TripSignalDetails.findByPk(req.params.id);
        signalDetail ? res.json(signalDetail) : res.status(404).json({ error: "Signal not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update a Trip Signal Detail
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await TripSignalDetails.update(req.body, { where: { id: req.params.id } });
        updated ? res.json({ message: "Signal detail updated" }) : res.status(404).json({ error: "Signal not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete a Trip Signal Detail
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await TripSignalDetails.destroy({ where: { id: req.params.id } });
        deleted ? res.json({ message: "Signal detail deleted" }) : res.status(404).json({ error: "Signal not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

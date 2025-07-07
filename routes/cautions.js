// routes/cautions.js
const express = require('express');
const Cautions = require('../models/Cautions');
const router = express.Router();

// Create a new caution
router.post('/', async (req, res) => {
    try {
        const caution = await Cautions.create(req.body);
        res.status(201).json(caution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all cautions
router.get('/', async (req, res) => {
    try {
        const cautions = await Cautions.findAll();
        res.json(cautions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a caution by ID
router.get('/:id', async (req, res) => {
    try {
        const caution = await Cautions.findByPk(req.params.id);
        if (!caution) return res.status(404).json({ error: 'Caution not found' });
        res.json(caution);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a caution
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Cautions.update(req.body, {
            where: { id: req.params.id },
        });
        if (!updated) return res.status(404).json({ error: 'Caution not found' });
        const updatedCaution = await Cautions.findByPk(req.params.id);
        res.json(updatedCaution);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a caution
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Cautions.destroy({
            where: { id: req.params.id },
        });
        if (!deleted) return res.status(404).json({ error: 'Caution not found' });
        res.status(200).send({message:'Caution deleted successfully'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all cautions for a specific sectionId
router.get('/section/:sectionId', async (req, res) => {
    try {
        const { sectionId } = req.params;
        const cautions = await Cautions.findAll({
            where: { sectionId },
            order: [['fromKMNumber', 'ASC']], // Optional: sort by fromKMNumber
        });

        if (!cautions.length) {
            return res.status(404).json({ message: 'No cautions found for this section' });
        }

        res.json(cautions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;

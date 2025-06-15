const express = require('express');
const Trips = require('../models/trips');
const User = require('../models/Users');
const Zones = require('../models/zone');
const Divisions = require('../models/division');
const Sections = require('../models/section');
const router = express.Router();

// ✅ Create Trip
router.post('/', async (req, res) => {
    try {
        const trip = await Trips.create(req.body);
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get All Trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trips.findAll();
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Trip By ID
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trips.findByPk(req.params.id);
        trip ? res.json(trip) : res.status(404).json({ error: "Trip not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Trip
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Trips.update(req.body, { where: { id: req.params.id } });
        updated ? res.json({ message: "Trip updated" }) : res.status(404).json({ error: "Trip not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Trip
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Trips.destroy({ where: { id: req.params.id } });
        deleted ? res.json({ message: "Trip deleted" }) : res.status(404).json({ error: "Trip not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reports', async (req, res) => {
    try {
        const trips = await Trips.findAll({
            include: [{
                model: Zones,
                attributes: ['name']
            },
            {
                model: Divisions,
                attributes: ['name']
            },
            {
                model: Sections,
                attributes: ['name']
            },
        {
            model:User,
            attributes: ['username']
        }]
        }
        );
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

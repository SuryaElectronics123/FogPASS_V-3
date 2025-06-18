const express = require('express');
const Sections = require('../models/section');
const router = express.Router();

router.get('', (req, res) => {
    if (req.query.divisionId) {
        Sections.findAll({
            where: req.query.divisionId ? {
                divisionId: req.query.divisionId
            } : undefined
        }).then(zones => {
            res.status(200).json(zones);
        })
    } else {
        res.status(500).json({ error: "Please select Division to get Sections" });

    }

})

router.get('/:routeId', (req, res) => {
    Sections.findOne({ where: { id: req.params.routeId } }).then(route => {
        res.status(200).json(route);
    })
})

router.post('/', (req, res) => {
    Sections.create({
        ...req.body
    }).then(zones => {
        res.status(200).json(zones);
    })
})

router.put('/:sectionId', (req, res) => {
    Sections.update({
        ...req.body
    }, {
        where: {
            id: req.params.sectionId
        }
    }).then(zones => {
        res.status(200).json(zones);
    })
})

router.put('/:sectionId/signal-update', async (req, res) => {
    try {
        const { deleted, added, edited } = req.body;

        // Find the section by ID
        let selectedSection = await Sections.findByPk(req.params.sectionId);
        if (!selectedSection) {
            return res.status(404).json({ message: "Section not found" });
        }

        let sectionSignals = selectedSection.signals;

        // Track actual deleted signals
        if (deleted?.length > 0) {
            sectionSignals = sectionSignals.filter(signal =>
                !deleted?.some(del => del.order === signal.order)
            );
        }


        // Track actual edited signals
        if (edited?.length > 0) {
            sectionSignals = sectionSignals.map(signal => {
                const editData = edited?.find(edit => edit.order === signal.order);
                return editData ? { ...signal, ...editData } : signal;
            });
        }


        // Track actual added signals
        if (added?.length > 0) {
            sectionSignals.push(...added);

        }

        // Sort and reassign order values sequentially
        sectionSignals.sort((a, b) => a.order - b.order);
        sectionSignals = sectionSignals.map((signal, index) => ({
            ...signal,
            order: index + 1
        }));

        // Update the section with modified signals
        await Sections.update(
            { signals: sectionSignals },
            { where: { id: req.params.sectionId } }
        );

        // Fetch the updated section
        const updatedSection = await Sections.findByPk(req.params.sectionId);

        // Include actual modification counts in response
        res.status(200).json({
            section: updatedSection,
            message: "Section signals updated successfully."
        });

    } catch (error) {
        console.error("Error updating signals:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});



router.delete('/:sectionId', (req, res) => {
    Sections.destroy({
        where: { id: req.params.sectionId }
    }).then(zones => {
        res.status(200).json(zones);
    })
})

module.exports = router;
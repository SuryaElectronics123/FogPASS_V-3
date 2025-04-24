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

module.exports = router;
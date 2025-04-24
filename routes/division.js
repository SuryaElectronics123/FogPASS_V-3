const express = require('express');
const Divisions = require('../models/division');
const router = express.Router();

router.get('', (req, res) => {
    if (req.query.zoneId) {
        Divisions.findAll({
            where: req.query.zoneId ? {
                zoneId: req.query.zoneId
            } : undefined
        }).then(zones => {
            res.status(200).json(zones);
        })
    } else {
        res.status(500).json({ error: "Please select Zone to get Divisions" });

    }

})

router.post('/', (req, res) => {
    Divisions.create({
        ...req.body
    }).then(zones => {
        res.status(200).json(zones);
    })
})

router.put('/:divisionId', (req, res) => {
    Divisions.update({
        ...req.body
    }, {
        where: {
            id: req.params.id
        }
    }).then(zones => {
        res.status(200).json(zones);
    })
})

module.exports = router;
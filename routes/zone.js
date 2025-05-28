const express = require('express');
const Zones = require('../models/zone');
const router = express.Router();

router.get('/', (req, res) => {
    Zones.findAll().then(zones => {
        res.status(200).json(zones);
    })
})

router.get('/:zoneId', (req, res) => {
    Zones.findOne({ where: { id: req.params.zoneId } }).then(zone => {
        res.status(200).json(zone);
    })
})

router.post('/', (req, res) => {
    Zones.create({
        ...req.body
    }).then(zones => {
        res.status(200).json(zones);
    })
})

router.put('/:zoneid', (req, res) => {
    Zones.update({
        ...req.body
    }, {
        where: {
            id: req.params.zoneid
        }
    }).then(zones => {
        res.status(200).json(zones);
    })
})

router.delete('/:zoneid', (req, res) => {
    Zones.destroy({
        where: { id: req.params.zoneid }
    }, {
        where: {
            id: req.params.id
        }
    }).then(zones => {
        res.status(200).json(zones);
    })
})

module.exports = router;
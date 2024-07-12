const express = require('express');
const CaptureLocation = require('../models/CaptureLocation');
const router = express.Router();

router.get('/:captureId', (req, res) => {
    CaptureLocation.findAll({ where: { captureId: req.params.captureId } }).then(location => {
        res.status(200).json(location);
    })
})

router.post('/', (req, res) => {
    CaptureLocation.create({
        ...req.body
    }).then(location => {
        res.status(200).json(location);
    })
})

module.exports = router;
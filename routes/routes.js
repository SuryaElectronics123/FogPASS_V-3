const express = require('express');
const Routes = require('../models/Routes');
const router = express.Router();

router.get('/', (req, res) => {
    Routes.findAll().then(routes => {
        res.status(200).json(routes);
    })
})

router.post('/', (req, res) => {
    Routes.create({
        ...req.body
    }).then(routes => {
        res.status(200).json(routes);
    })
})

router.put('/:trainCode', (req, res) => {
    Routes.update({
        ...req.body
    }, {
        where: {
            trainCode: req.params.trainCode
        }
    }).then(routes => {
        res.status(200).json(routes);
    })
})

module.exports = router;
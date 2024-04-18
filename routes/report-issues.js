const express = require('express');
const Issues = require('../models/issue');
const router = express.Router();

router.post('/report-issue', (req, res) => {
    Issues.create({
        ...req.body,
        raisedBy: req.userInfo.id,
        status: 'NEW',
        createdTime: new Date(),
        lastUpdatedTime: new Date(),
    }).then(issues => {
        res.status(200).json(issues);
    })

});

router.get('/view-reported-issues', (req, res) => {
    Issues.findAll({
        where: {
            raisedBy: req.userInfo.id,
        }
    }).then(issues => {
        res.status(200).json(issues);
    })
});

router.get('/view-all-issues', (req, res) => {
    Issues.findAll({}).then(issues => {
        res.status(200).json(issues);
    })
});

router.put('/:id', (req, res) => {
    Issues.update({
        where: { id: req.params.id }
    }, req.body).then(issues => {
        res.status(200).json(issues);
    })
});

module.exports = router;
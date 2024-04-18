const express = require('express');
const Routes = require('../models/Routes');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getPrivateKeyVal = require('../security/index');


var privateKeyVal;

getPrivateKeyVal().then(res => {
    privateKeyVal = res;
})

router.get('/details', (req, res) => {
    let decodedVal = jwt.verify(req.headers.access_token, privateKeyVal);
    console.log(decodedVal);
    res.status(200).json(decodedVal);

})


router.get('/logout', (req, res) => {
    // let decodedVal = jwt.(req.headers.access_token, privateKeyVal);
    // console.log(decodedVal);
    res.status(200).json({});

})

module.exports = router;
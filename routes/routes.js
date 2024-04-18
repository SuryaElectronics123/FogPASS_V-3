const express = require('express');
const Routes = require('../models/Routes');
const router = express.Router();

router.get('/',(req,res)=>{
    Routes.find().then(routes=>{
        res.status(200).json(routes);
    })
})

module.exports = router;
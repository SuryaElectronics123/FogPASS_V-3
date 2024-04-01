const express = require('express');
const User = require('../models/Users');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const router = express.Router();


dotenv.config();

// middleware that is specific to this router
const timeLog = (req, res, next) => {
    console.log('Time: ', Date.now())
    next()
}
router.use(timeLog)

// define the home page route
router.post('/login', async (req, res) => {
    const user = await User.findOne({ userName: req.body.userName });
    if (user) {
        const password_valid = await bcrypt.compare(req.body.password, user.password);
        if (password_valid) {
            let token = jwt.sign({ ...user.dataValues, password: undefined }, process.env.JWT_KEY);
            res.status(200).json({ token: token });
        } else {
            res.status(400).json({ error: "Password Incorrect" });
        }

    } else {
        res.status(404).json({ error: "User does not exist" });
    }

})
// define the about route
router.post('/register', async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    User.create({ ...req.body, password: await bcrypt.hash(req.body.password, salt) })
        .then((user) => {
            let response = user.dataValues;
            res.send({ ...response, password: undefined })
        }).catch(err => {
            res.status(500).send({
                status: 'ERROR',
                errors: err.message
            })
        })
})

module.exports = router
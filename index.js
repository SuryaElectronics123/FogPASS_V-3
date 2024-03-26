const express = require('express')
const app = express()
const port = 3000
const router = express.Router();

const auth = require('./routes/auth');
const sequelize=require('./models/index')

app.use(express.json());
app.use('/auth',auth)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
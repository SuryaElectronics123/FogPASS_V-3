const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const router = express.Router();

const auth = require('./routes/auth');

app.use(express.json());
app.use(cors())
app.get('/health-check', (req, res) => {
    res.send('success');
})
app.use('/auth', auth)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
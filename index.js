const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('./routes/auth');
const routes = require('./routes/routes');
const profile = require('./routes/profile');
const reportIssues = require('./routes/report-issues');
const getPrivateKeyVal = require('./security/index');


var privateKeyVal;

getPrivateKeyVal().then(res => {
    privateKeyVal = res;
})

app.use(express.json());
app.use(cors())
app.get('/health-check', (req, res) => {
    res.send('success');
})
app.use('/auth', auth);
app.use((req, res) => {
    // req.next()
    try {
        if (req.headers.access_token) {
            if (jwt.verify(req.headers.access_token, privateKeyVal)) {
                req['userInfo'] = jwt.verify(req.headers.access_token, privateKeyVal);
                req.next()
            } else {
                res.status(401).json({ 'error': 'Access Denied!!' })
            }
        } else {
            res.status(401).json({ 'error': 'Provide access token' })
        }

    } catch (error) {
        res.status(401).json({ 'error': 'Access Denied!!' })
    }

});
// app.use('/routes', routes);
app.use('/profile', profile);
app.use('/issues', reportIssues);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
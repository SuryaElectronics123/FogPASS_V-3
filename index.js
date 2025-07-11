const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = 3000
const auth = require('./routes/user-management');
const routes = require('./routes/routes');
const profile = require('./routes/profile');
const assets = require('./routes/assets');
const zones = require('./routes/zone');
const Cautions = require('./routes/cautions');
const fileupload = require('./routes/fileupload');
const divisions = require('./routes/division');
const sections = require('./routes/section');
const localizedMessages = require('./routes/LocalizedMessage');
const reportIssues = require('./routes/report-issues');
const signalRoutes = require('./routes/tripSignalDetails');
const tripsRoutes = require('./routes/trips');
const captureLoction = require('./routes/capture-location');
const getPrivateKeyVal = require('./security/index');



var privateKeyVal;

getPrivateKeyVal().then(res => {
    privateKeyVal = res;
})

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'fog-pass-admin-ui')));
app.use(cors())


const router = express.Router();
router.get('/health-check', (req, res) => {
    res.send('success');
})
router.use('/assets', assets);
router.use('/user-management', auth);
router.use('/profile', profile);
router.use('/issues', reportIssues);
router.use('/routes', routes);
router.use('/zones', zones);
router.use('/divisions', divisions);
router.use('/sections', sections);
router.use('/capture-location', captureLoction);
router.use('/fileupload', fileupload);
router.use('/trips', tripsRoutes);
router.use('/tripSignalDetails', signalRoutes);
router.use('/cautions', Cautions);
router.use('/localizedMessages', localizedMessages);
app.use('/api', router);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'fog-pass-admin-ui/index.html'));
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
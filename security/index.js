const fs = require('fs/promises');
const path = require('path');
const { dirname } = require('path');


module.exports = async function getPrivateKeyVal() {
    return fs.readFile(path.resolve(__dirname, './password.txt'), 'utf-8');
}
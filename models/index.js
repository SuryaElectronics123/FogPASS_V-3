const { default: mongoose } = require("mongoose");

mongoose.connect('mongodb://localhost:27017').then((res) => {
    module.exports = res;
}, (err) => {

});


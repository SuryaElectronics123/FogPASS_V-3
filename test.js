var jwt = require('jsonwebtoken');
var token = jwt.sign({
    "_id": "660a9405d475a0c98cbcdb85",
    "userName": "test",
    "role": "test",
    "__v": 0,
    "id": "660a9405d475a0c98cbcdb85",
    "iat": 1712136022
}, 'shhhhh');
// var token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjBhOTQwNWQ0NzVhMGM5OGNiY2RiODUiLCJ1c2VyTmFtZSI6InRlc3QiLCJyb2xlIjoidGVzdCIsIl9fdiI6MCwiaWQiOiI2NjBhOTQwNWQ0NzVhMGM5OGNiY2RiODUiLCJpYXQiOjE3MTIxMzYwMjJ9.XBSjmyrrrG4a_NeIa5Niwj8iFxOjIjghcIUx-h0C2zA';
// some time later
console.log(token)
var decodedClaims = jwt.verify(token, 'shhhhh');
console.log(JSON.stringify(decodedClaims))
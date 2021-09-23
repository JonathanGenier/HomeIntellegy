require('dotenv').config()
var jwksClient = require('jwks-rsa');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var client = jwksClient({
  strictSsl: false,
  jwksUri: process.env.JWKSURI
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
  });
}

function verifyToken(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  //console.log(token)
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token.split(' ')[1], getKey, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    next();
  });
}

function checkClaims(req, res, next){         //answering with an array of string for the claims
  var token = req.headers['scopes'];
  console.log(token);
  
  // console.log(response);
}

function authorize(req, res, next){
  verifyToken(req, res, next);
  //checkClaims(req, res, next);
}

module.exports = {
  verifyToken,
  authorize
};
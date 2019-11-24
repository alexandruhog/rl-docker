const validator = require("validator");
const HttpStatus = require("http-status-codes");
const ProviderJWT = require("./ProviderJWT.js");
const {genereazaEroare} = require("../utils/Erori.js");

module.exports.autorizeazaToken = async (req, res, next) => {

  if (!req.headers.authorization) {
    throw new Error('Neautorizat!');
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!validator.isJWT(token)) {
    throw new Error('Tokenul nu este valid!');
  }
  const decoded = await ProviderJWT.verificaToken(token);
  if (!decoded) {
    throw new Error('Neutorizat!');
  }
  req.state = decoded;
  next();
  
};
const jwt = require("jsonwebtoken");

module.exports.genereazaToken = async data => {

    const token = await jwt.sign(data, process.env.SECRET, {
        expiresIn: process.env.TIMP_EXPIRARE
    });
    return token;
};

module.exports.verificaToken = async token => {
    
    let result = await jwt.verify(token, process.env.SECRET);
    return result;
    
};
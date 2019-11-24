const Router = require('express').Router();
const ServiciuAutentificare = require('../services/ServiciuAutentificare.js');
const HttpStatus = require("http-status-codes");
const ServerError = require('../utils/Erori.js');

Router.post('/inregistrare', async (req, res, next) => {
    const {
        email,
        password,
    } = req.body;
    if (!email) {
        throw new ServerError('Email is missing').setStatus(HttpStatus.BAD_REQUEST);
    }
    if (!password) {
        throw new ServerError('Password is missing').setStatus(HttpStatus.BAD_REQUEST);
    }
    
    const data = await ServiciuAutentificare.inregistrare(req.body.email, req.body.password);
    res.status(HttpStatus.CREATED).json(data);

});

Router.post('/autentificare', async (req, res, next) => {

    const data = await ServiciuAutentificare.autentificare(req.body.email, req.body.password);
    res.status(HttpStatus.OK).json(data);
    
});

// ca sa fie si mai frumos, pe langa Router, returnez si cale
// uitati-va in app.js cum leg calea de ruter
// linia 22 si linia 23 in app.js

module.exports = {
    cale: 'auth',
    router: Router
}
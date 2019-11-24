const HttpStatus = require("http-status-codes");

const CodificatorParola = require('../security/CodificatorParola.js');
const dbConnector = require('../data/Conexiune.js');
const {genereazaEroare} = require('../utils/Erori.js');
const ProviderJWT = require("../security/ProviderJWT.js");
const ServerError = require('../utils/Erori.js');

module.exports.inregistrare = async (email, password) => {

    const parolaCriptata = await CodificatorParola.cripteaza(password);
    try {
        const result = await dbConnector.query('SELECT * FROM utilizatori WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            throw new ServerError('Utilizatorul deja exista!').setStatus(HttpStatus.CONFLICT);
        } else {
            await dbConnector.query('INSERT INTO utilizatori (email, password) VALUES ($1, $2)', [email, parolaCriptata])
            return {
                message: `Utilizator ${email} inregistrat cu succes!`,
            }
        }
    } catch (err) {
        throw err;
    }

};

module.exports.autentificare = async (email, password) => {

    try {
        const result = await dbConnector.query('SELECT id, password FROM utilizatori WHERE email = $1', [email]);
        if (result.rows.length === 1) {
            const utilizator = result.rows[0];
            const match = await CodificatorParola.compara(password, utilizator.password);

            if (match) {
                const token = await ProviderJWT.genereazaToken({
                    id: utilizator.id,
                    email: email,
                });
                return {
                    message: 'Autentificare cu succes!',
                    data: {
                        token: token
                    }
                };
            } else {
                throw new ServerError('Email sau parola gresite!').setStatus(HttpStatus.BAD_REQUEST);
            }
        } else {
            throw new ServerError('Utilizatorul nu este inregistrat!').setStatus(HttpStatus.UNAUTHORIZED);
        }
    } catch (err) {
        throw err;
    };
    
};
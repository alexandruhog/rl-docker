const Router = require('express').Router();
const ServiciuPoze = require('../services/ServiciuPoze.js');
const FiltruJWT = require('../security/FiltruJWT.js');
const multer = require('multer');
const HttpStatus = require('http-status-codes');
const sharp = require('sharp');
const fileType = require('file-type');
const fs = require('fs');

const utilitarFisiere = require('../utils/Fisiere.js');
const ServerError = require('../utils/Erori.js');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

Router.post('/like', FiltruJWT.autorizeazaToken, async (req, res, next) => {
    const {
        idPoza,
    } = req.body;
    
    if (!idPoza) {
        throw new ServerError('Id poza is missing').setStatus(HttpStatus.BAD_REQUEST);
    }

    const data = await ServiciuPoze.likeDeLaUtilizator(req.body.idPoza, req.state.id);
    res.status(HttpStatus.OK).json(data);
})

Router.post('/', FiltruJWT.autorizeazaToken, upload.single('poza'), async (req, res, next) => {

    if (!req.file.buffer) {
        throw new ServerError('File is missing').setStatus(HttpStatus.BAD_REQUEST);
    }

    let mime = fileType(req.file.buffer);
    if (!mime || !utilitarFisiere.extensiiAcceptate.includes(mime.ext)){
        throw new Error('Doar jpg, jpeg sau png!');
    }
    let fileName = `${Date.now()}.${mime.ext}`;
    const fullPath = utilitarFisiere.calculeazaCalePoze(fileName);
    try {
        await sharp(req.file.buffer)
        // .resize(1080, 1350)
        .toFile(fullPath);
    } catch (err) {
        console.log(err);
        throw err;
    }


    const data = await ServiciuPoze.postatDeUtilizator(fileName, req.state.id);
    data.poza = Buffer.from(req.file.buffer).toString('base64');
    res.status(HttpStatus.CREATED).json(data);

});

Router.get('/like', FiltruJWT.autorizeazaToken, async (req, res, next) => {
    const data = await ServiciuPoze.pozeleMeleLikeuite(req.state.id, req.query.pageSize, req.query.pageNo);
    res.status(HttpStatus.OK).json(data);
})

Router.get('/colectiaMea', FiltruJWT.autorizeazaToken, async (req, res, next) => {
    const data = await ServiciuPoze.pozelePuseDeMine(req.state.id, req.query.pageSize, req.query.pageNo);
    res.status(HttpStatus.OK).json(data);
})

Router.get('/count', FiltruJWT.autorizeazaToken, async(req, res, next) => {
    const data = await ServiciuPoze.numaraPoze();
    res.status(HttpStatus.OK).json(data);
})

Router.get('/', FiltruJWT.autorizeazaToken, async (req, res, next) => {
    const data = await ServiciuPoze.toatePozele(req.state.id, req.query.pageSize, req.query.pageNo);
    res.status(HttpStatus.OK).json(data);
})


// ca sa fie si mai frumos, pe langa Router, returnez si cale
// uitati-va in app.js cum leg calea de ruter
// linia 22 si linia 23 in app.js
module.exports = {
    cale: 'poze',
    router: Router
}
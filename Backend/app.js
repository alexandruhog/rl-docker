const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
require('express-async-errors');
const HttpStatus = require('http-status-codes');

// TEMA 1 Cautati pe internet ce fac pachetele de mai sus! 

const controllerAutentificare = require('./controllers/Autentificare.js');
const controllerPoze = require('./controllers/Poze.js');

// cele doua controllere pe care le-am facut

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('tiny'));

app.use(`/api/${controllerAutentificare.cale}`, controllerAutentificare.router);
app.use(`/api/${controllerPoze.cale}`, controllerPoze.router);

app.use((err, req, res, next) => {
    console.log(err);
    let status = 500;
    let message = "Ne pare rau, s-a produs o eroare!";
    if (err.httpStatus) {
        status = err.httpStatus;
        message = err.message;
    }
    res.status(status).json({
        error: message
    });
});

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log(`app is listening on port ${process.env.PORT}`);
    }
});

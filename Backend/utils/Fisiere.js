const path = require('path');

module.exports.calculeazaCalePoze = (fileName) => {
    return path.join(process.cwd(), 'poze', fileName);
} 

module.exports.extensiiAcceptate = ['jpg', 'png', 'jpeg'];
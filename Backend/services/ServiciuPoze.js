const fs = require('fs');
const HttpStatus = require("http-status-codes");

const dbConnector = require('../data/Conexiune.js');
const utilitarFisiere = require('../utils/Fisiere.js');

const ServerError = require('../utils/Erori.js');

let creazaVectorPoze = (listaPoze) => {
    const poze = [];

    for (let i = 0; i < listaPoze.length; i++ ){
        try {
            const pozaBytes = fs.readFileSync(utilitarFisiere.calculeazaCalePoze(listaPoze[i].nume));
            poze.push({
                id: listaPoze[i].id,
                nume: listaPoze[i].nume,
                likes: listaPoze[i].likes,
                likeFromMe: listaPoze[i].like_from_me,
                poza: Buffer.from(pozaBytes).toString('base64')
            });
        } catch (err) {
            throw err;
        }
    }
    return poze;
}

module.exports.postatDeUtilizator = async (numePoza, idUtilizator) => {

    try {
        const result = await dbConnector.query('INSERT INTO poze (nume, id_utilizator) VALUES ($1, $2) RETURNING *', [numePoza, idUtilizator])
        return {
            message: `Poza introusa cu succes`,
            data: {
                id: result.rows[0].id,
                nume: result.rows[0].nume,
                likes: result.rows[0].likes,
                likeFromMe: 0
            }
        }
    } catch (err) {
        throw err;
    }

};

module.exports.likeDeLaUtilizator = async (idPoza, idUtilizator) => {

    try {
        let result = await dbConnector.query('SELECT * FROM likes WHERE id_poza = $1 AND id_utilizator = $2', [idPoza, idUtilizator]);
        if (result.rows.length > 0) {
            await dbConnector.query('DELETE FROM likes WHERE id_utilizator = $1 AND id_poza = $2', [idUtilizator, idPoza]);
            result = await dbConnector.query('UPDATE poze SET likes = likes - 1 WHERE id = $1 RETURNING *', [idPoza]);
            const numePoza = result.rows[0].nume;
            return {
                message: `Poza ${numePoza} a fost dislike-uita cu succes`
            }
        } else {
            await dbConnector.query('INSERT INTO likes (id_utilizator, id_poza) VALUES ($1, $2)', [idUtilizator, idPoza]);
            result = await dbConnector.query('UPDATE poze SET likes = likes + 1 WHERE id = $1 RETURNING *', [idPoza]);
            const numePoza = result.rows[0].nume;
            return {
                message: `Poza ${numePoza} a fost like-uita cu succes`
            }
        }
    } catch (err) {
        throw err;
    }

};

module.exports.pozeleMeleLikeuite = async (idUtilizator, pageSize, pageNo) => {

    const limit = pageSize;
    const offset = limit * (pageNo - 1);

    try {
        const result = await dbConnector.query(`SELECT p.id, p.nume, p.likes FROM likes l 
                                    JOIN poze p ON (p.id = l.id_poza)
                                    WHERE l.id_utilizator = $3
                                    LIMIT $1 
                                    OFFSET $2`, [limit, offset, idUtilizator]);
        const poze = creazaVectorPoze(result.rows);

        return {
            message: 'Pozele',
            data: {
                poze: poze
            }
        }
    } catch (err) {
        throw err;
    }

}

module.exports.pozelePuseDeMine = async (idUtilizator, pageSize, pageNo) => {

    const limit = pageSize;
    const offset = limit * (pageNo - 1);

    try {
        const result = await dbConnector.query(`SELECT p.id, p.nume, p.likes,
                                        (SELECT COUNT(l.id_utilizator) as like_from_me 
                                        FROM likes l 
                                        WHERE l.id_utilizator = $3 AND l.id_poza = p.id)
                                    FROM poze p
                                    WHERE p.id_utilizator = $3
                                    LIMIT $1 
                                    OFFSET $2`, [limit, offset, idUtilizator]);
        const poze = creazaVectorPoze(result.rows);

        return {
            message: 'Pozele',
            data: {
                poze: poze
            }
        }
    } catch (err) {
        throw err;
    }

}

module.exports.toatePozele = async (idUtilizator, pageSize, pageNo) => {

    const limit = pageSize;
    const offset = limit * (pageNo - 1);
    try {
        const result = await dbConnector.query(`SELECT p.id, p.nume, p.likes,
                                        (SELECT COUNT(l.id_utilizator) as like_from_me 
                                        FROM likes l 
                                        WHERE l.id_utilizator = $3 AND l.id_poza = p.id)
                                    FROM poze p
                                    LIMIT $1 
                                    OFFSET $2`, [limit, offset, idUtilizator])
        const poze = creazaVectorPoze(result.rows);
        return {
            message: 'Pozele',
            data: {
                poze: poze
            }
        }
    } catch (err) {
        throw err;
    }

}

module.exports.numaraPoze = async () => {

    try {
        const result = await dbConnector.query('SELECT COUNT(*) FROM POZE', []);
        return {
            message: "Numarul de poze",
            data: {
                number: result.rows[0]
            }
        }
    } catch (err) {
        throw err;
    }
}
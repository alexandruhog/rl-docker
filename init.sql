CREATE TABLE IF NOT EXISTS utilizatori (
    id serial PRIMARY KEY,
    email varchar NOT NULL,
    password varchar NOT NULL
);

CREATE TABLE IF NOT EXISTS poze (
    id serial PRIMARY KEY,
    nume varchar NOT NULL,
    id_utilizator integer REFERENCES utilizatori(id) NOT NULL,
    likes integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS likes (
    id_poza integer REFERENCES poze(id),
    id_utilizator integer REFERENCES utilizatori(id),
    PRIMARY KEY(id_poza, id_utilizator)
);
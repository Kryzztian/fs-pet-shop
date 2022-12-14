DROP TABLE IF EXISTS pets;
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    name TEXT,
    kind TEXT
);

INSERT INTO pets (id) VALUES (0);
INSERT INTO pets (age, name, kind) VALUES (7, 'fido', 'dog');
INSERT INTO pets (age, name, kind) VALUES (5, 'buttons', 'snake');
INSERT INTO pets (age, name, kind) VALUES (12, 'luna', 'kitty');
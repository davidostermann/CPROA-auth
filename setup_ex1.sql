DROP TABLE IF EXISTS users_cards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS lists;

CREATE TABLE lists
(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

INSERT INTO lists
  (name)
VALUES
  ('Backlogs'),
  ('A faire'),
  ('En cours'),
  ('Fait');

CREATE TABLE cards
(
  id SERIAL PRIMARY KEY,
  list_id integer REFERENCES lists ON DELETE SET NULL,
  name VARCHAR(255)
);

INSERT INTO cards
  (name, list_id)
VALUES
  ('Connecter l''appli à la BDD', 1),
  ('Faire une requête SQL', 1),
  ('Faire une relation one to many', 3),
  ('Faire une relation many to many', 3),
  ('Faire une appli NodeJS', 2),
  ('Créer des routes d''API', 4),
  ('Créer la web pour interroger l''API', 1);

CREATE TABLE users
(
  id SERIAL PRIMARY KEY,
  lastname varchar(255),
  firstname varchar(255)
);

INSERT INTO users
  (firstname, lastname)
VALUES
  ('David', 'Ostermann'),
  ('Faustino', 'Kialungila'),
  ('Paljor', 'Tsang'),
  ('Gaelle', 'Meric'),
  ('Joffrey', 'Gitau'),
  ('Mehdi', 'Druon'),
  ('Martin', 'Eon'),
  ('Julien', 'Grach');

CREATE TABLE users_cards
(
  user_id integer REFERENCES users ON DELETE CASCADE,
  card_id integer REFERENCES cards ON DELETE CASCADE,
  PRIMARY KEY (user_id, card_id)
);

INSERT INTO users_cards
  (user_id, card_id)
VALUES
  (1, 3),
  (1, 1),
  (1, 7),
  (2, 1),
  (3, 4),
  (3, 5),
  (5, 2),
  (5, 3),
  (6, 6),
  (6, 4),
  (7, 7),
  (8, 2),
  (8, 3),
  (8, 6);
const db = require("./db");

const card = {};

card.getCards = () => {
  return db.query("SELECT * FROM cards ORDER BY id");
};
card.createCard = ({ name }) => {
  return db.query(`INSERT INTO cards(name) VALUES ('${name}')`);
};
card.updateCard = ({ id, name }) => {
  return db.query(`UPDATE cards SET name='${name}' WHERE id=${id}`);
};
card.deleteCard = id => {
  return db.query(`DELETE FROM cards WHERE id=${id}`);
};

module.exports = card;

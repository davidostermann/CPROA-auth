const db = require("./db");
const { encode } = require("../auth/pwd");
const defaultListId = 1;

const user = {};

user.getUsers = () => {
  return db.unwrapQuery("SELECT * FROM users ORDER BY id");
};

user.createUser = ({ firstname, lastname, email, password }) => {
  return encode(password).then(hashPwd =>
    db.query(`
  INSERT INTO users(firstname, lastname, email, password, role)
  VALUES ('${firstname}', '${lastname}', '${email}', '${hashPwd}', 'user')`)
  );
};

user.updateUser = ({ id, firstname, lastname }) => {
  return db.unwrapQuery(`
    UPDATE users 
    SET firstname='${firstname}', lastname='${lastname}'
    WHERE id=${id}`);
};

user.deleteUser = id => {
  return db.unwrapQuery(`DELETE FROM users WHERE id=${id}`);
};

user.addCard = ({ userId, cardId }) => {
  return db.unwrapQuery(`
    INSERT INTO users_cards_lists SET 
    user_id=${userId}, 
    card_id=${cardId}, 
    list_id=${defaultListId}`);
};

user.setListCard = ({ userId, cardId, listId }) => {
  return db.unwrapQuery(`
    UPDATE users_cards_lists 
    SET list_id=${listId}
    WHERE user_id=${userId} 
    AND card_id=${cardId}`);
};

user.noExists = email => {
  return db
    .query(`SELECT * FROM users WHERE email='${email}'`)
    .then(result => result.rows.length === 0);
};

user.getUserByEmail = email => {
  return (
    db
      .unwrapQuery(`SELECT * FROM users WHERE email='${email}'`)
      .then(data => data[0] || false)
      //.then( data => data[0] || Promise.reject({error : `user with email ${email} doesn't exist`}))
      .catch(err => Promise.reject(err))
  );
};

user.getUserById = id => {
  return db
    .unwrapQuery(`SELECT * FROM users WHERE id='${id}'`)
    .then(data => data[0] || false)
    .catch(err => Promise.reject(err));
};

module.exports = user
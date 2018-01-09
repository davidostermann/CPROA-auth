const db = require('./db')
const defaultListId = 1;

module.exports = {
  getUsers() {
    return db.unwrapQuery("SELECT * FROM users ORDER BY id");
    //query => {rows[user1, user2, ...]}
    // unwrapQuery => [user1, user2, ...]
  },
  createUser({ firstname, lastname }) {
    return db.unwrapQuery(`
    INSERT INTO users(firstname, lastname)
    VALUES ('${firstname}', '${lastname}')`);
  },
  updateUser({ id, firstname, lastname }) {
    return db.unwrapQuery(`
    UPDATE users 
    SET firstname='${firstname}', lastname='${lastname}'
    WHERE id=${id}`);
  },
  deleteUser(id) {
    return db.unwrapQuery(`DELETE FROM users WHERE id=${id}`);
  },
  addCard({ userId, cardId }) {
    return db.unwrapQuery(`
    INSERT INTO users_cards_lists SET 
    user_id=${userId}, 
    card_id=${cardId}, 
    list_id=${defaultListId}`);
  },
  setListCard({ userId, cardId, listId }) {
    return db.unwrapQuery(`
    UPDATE users_cards_lists 
    SET list_id=${listId}
    WHERE user_id=${userId} 
    AND card_id=${cardId}`);
  },
  noExists(email) {
    return db
      .query(`SELECT * FROM users WHERE email='${email}'`)
      .then(result => result.rows.length === 0);
  },
  getUserByEmail(email) {
    return db.unwrapQuery(`SELECT * FROM users WHERE email='${email}'`)
    .then( data => data[0] || false )
    // .then( data => data[0] || Promise.reject({error : `user with email ${email} doesn't exist`}))
    .catch( err => Promise.reject(err))
  },
  getUserById(id) {
    return db.unwrapQuery(`SELECT * FROM users WHERE id='${id}'`)
    .then( data => data[0] || false )
    .catch( err => Promise.reject(err))
  }
};
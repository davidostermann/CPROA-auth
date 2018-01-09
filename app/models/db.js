const { Client } = require('pg');
const db = new Client({
  connectionString : 'postgres://dost:changeme@localhost:5432/trellodb'
})

db.connect((err) => {
  if (err) {
    return console.log(err)
  }
  console.log('DB CONNECTED !!!!')
})

db.unwrapQuery = (sql) => {
  return db.query(sql)
  .then( results => results.rows )
  .catch( err => Promise.reject(err) )
}

module.exports = db
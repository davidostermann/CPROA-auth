const bcrypt = require('bcrypt-nodejs')
const user = require('../models/user')
//return bcrypt.hashSync(pwd, 5);

exports.encode = pwd => {

  if(!pwd) return Promise.reject({error: 'password empty'})

  return new Promise( (resolve, reject) => {
    bcrypt.genSalt( 5, (err, salt) => { 
      if(err) {
        return reject(err)
      }

      bcrypt.hash( pwd, salt, null, (error, hash) => {
        return error ? reject(error) : resolve(hash)
      })
    })
  })
}

const compare = exports.compare = (pwdEnClaire, pwdEnHash) => {
  return new Promise( (resolve, reject) => {
    bcrypt.compare(pwdEnClaire, pwdEnHash, (err, result) => {
      if(err) {
        return reject(err)
      }

      resolve(result) // result est égal à true ou false
    });
  })
}

/**
 * 
 *  
 * verifie que le password passé en paramètre est le même que le password stocké en BDD
 * Step 1 : récupérer le user associé à l'email : getUserByEmail
 * Step2 : Comparer le password du user avec le password passé en parametre
 * @param {string} email 
 * @param {string} password - password en clair
 */
exports.checkCredentials = (email, passwordEnClair) => {
  return user
    .getUserByEmail(email)
    .then(user => user || Promise.reject({ error: "bad email" }))
    .then(user => compare(passwordEnClair, user.password))
    .then(isMatch => isMatch || Promise.reject({ error: "bad password" }))
    .catch(err => Promise.reject(err));
}
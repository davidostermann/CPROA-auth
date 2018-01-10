const bcrypt = require('bcrypt-nodejs')
const user = require('../models/user')

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
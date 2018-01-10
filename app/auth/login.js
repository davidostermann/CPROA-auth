const user = require("../models/user");
const { compare } = require("./pwd");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const checkCredentials = (
  email,
  passwordEnClair,
  done
) => {
  let u;
  return user
    .getUserByEmail(email)
    .then(user => {
      console.log("user : ", user);
      return user;
    })
    .then(user => {
      u = user;
      return user || done(null, false, { error: "bad email" });
    })
    .then(user => compare(passwordEnClair, user.password))
    .then(isMatch => {
      console.log("isMatch : ", isMatch);
      return isMatch;
    })
    .then(isMatch => {
      return isMatch ? done(null, u) : done(null, false, {
          error: "bad password"
        });
      })
    .catch(err => done(err));
}

// pour les testes
exports.checkCredentials = checkCredentials;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    checkCredentials
  )
);

// expose le middleware qui valide le login
exports.authCredentials = passport.authenticate('local', { session: false })

// exports.checkCredentials = (email, passwordEnClair, done) => {
//   return user
//     .getUserByEmail(email)
//     .then( user => { console.log('user : ', user); return user})
//     .then( user => { return user || Promise.reject({ error: "bad email" })) }
//     .then( user => compare(passwordEnClair, user.password))
//     .then( isMatch => isMatch || Promise.reject({ error: "bad password" }))
//     .catch(err => Promise.reject(err));
// };

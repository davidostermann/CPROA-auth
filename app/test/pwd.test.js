const { encode, compare } = require("../auth/pwd");
const { checkCredentials } = require('../auth/login')

test('PWD encode', () => {
  return encode('coucou')
  .then( hash => expect(hash).toBeDefined() )
})

test("PWD encode empty password generate error", () => {
  return encode()
  .then( t => console.log('t : ', t))
  .catch(err => { 
    return expect(err).toBeDefined()
  });
});

// promise style
test("PWD compare true", () => {
  return encode("coucou")
    .then(hash => compare("coucou", hash))
    .then(isMatch => expect(isMatch).toBe(true));
})

// async await style
// test('PWD compare true', async () => {
//   const hash = await encode('coucou')
//   const isMatch = await compare('coucou', hash)
//   expect(isMatch).toBe(true)
// })

// test("PWD compare log", () => {
//   return encode("coucou").then( hash => console.log(hash))
// });

test("PWD compare false", () => {
  return encode("coucou")
    .then(hash => compare("kiki", hash))
    .then(isMatch => expect(isMatch).toBe(false))
});

test('checkCredentials return TRUE for good credentials', () => {
  return checkCredentials("do@do.do", "bacon")
    .then(data => expect(data).toBe(true))
})

test("checkCredentials reject 'bad email' for bad email", () => {
  expect.assertions(1); // pas d'assertion => on n'est pas passé dans le catch
  return checkCredentials("baddo@do.do", "bacon").catch(err =>
    expect(err.error).toBe("bad email")
  );
  // OU
  //return expect(checkCredentials("do@do.do", "bacon")).rejects.toEqual({error: 'bad email'})
});

test("checkCredentials reject 'bad password' for bad password", () => {
  expect.assertions(1); // pas d'assertion => on n'est pas passé dans le catch
  return checkCredentials("do@do.do", "badbacon").catch(err =>
    expect(err.error).toBe("bad password")
  );
  // OU
  //return expect(checkCredentials("do@do.do", "badbacon")).rejects.toEqual({error: 'bad password'});
});

// REF : https://facebook.github.io/jest/docs/en/tutorial-async.html
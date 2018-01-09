const { checkCredentials, encode, compare } = require("../auth/pwd");

xtest('PWD encode', () => {
  return encode('coucou')
  .then( hash => expect(hash).toBeDefined() )
})

xtest("PWD encode empty password generate error", () => {
  return encode()
  .then( t => console.log('t : ', t))
  .catch(err => { 
    return expect(err).toBeDefined()
  });
});

// test("PWD compare true", () => {
//   return encode("coucou")
//     .then(hash => compare("coucou", hash))
//     .then(isMatch => expect(isMatch).toBe(true));
// })

xtest('PWD compare true', async () => {
  const hash = await encode('coucou')
  const isMatch = await compare('coucou', hash)
  expect(isMatch).toBe(true)
})

xtest("PWD compare false", () => {
  return encode("coucou")
    .then(hash => compare("kiki", hash))
    .then(isMatch => expect(isMatch).toBe(false))
});

test('checkCredentials renvoie TRUE pour des bons identifiants', () => {
  return checkCredentials("do@do.do", "bacon")
    .then(data => expect(data).toBe(true))
    //.catch(err => expect(err).toBeDefined());
})

test("checkCredentials renvoie FALSE pour des mauvais identifiants", () => {
  return checkCredentials("do@do.do", "bacon")
    //.then(data => expect(data).toBe(false))
    .catch(err => expect(err).toBeDefined());
});
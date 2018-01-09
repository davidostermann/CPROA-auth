const user = require('../models/user') 

test("getUsers results is defined", () => {
  return user.getUsers().then(results => expect(results).toBeDefined());
});

test("getUsers has at least one item", () => {
  return user
    .getUsers()
    .then(results => expect(results.length).toBeGreaterThan(0));
});

test("getUsers return 8 items", () => {
  return user.getUsers()
  .then(results => expect(results.length).toBe(8));
});

test('noExists return true for coucou@coucou.fr', () => {
  return user.noExists('coucou@coucou.fr').then(
    bool => expect(bool).toBe(true)
  );
})

test('getUserByEmail return a user object', () => {
  return user.getUserByEmail('do@do.do')
  .then( data => {
    return expect(data.firstname).toBeDefined()
  })
});

xtest("getUserByEmail return an error for fake email", () => {
  return user.getUserByEmail("fake@do.do")
  .then(data => expect(new Error('ne doit jamais être appelé')).not.toHaveBeenCalled())
  //.catch( err => expect(err).toBeDefined())
});

test("getUserById return a user object", () => {
  return user.getUserById(1).then(data => {
    return expect(data.firstname).toBeDefined();
  });
});

xtest("getUserById return an error for fake ID", () => {
  return user
    .getUserById(999)
    .then(data =>
      expect(new Error("ne doit jamais être appelé")).not.toHaveBeenCalled()
    );
  //.catch( err => expect(err).toBeDefined())
});
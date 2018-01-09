const user = require('../models/user') 

test('getUsers return 8 items', () => {
  return user.getUsers()
  .then( results => expect(results.length).toBe(8))
})

test('noExists return false', () => {
  return user.noExists("do@do.do").then(result => expect(result).toBe(false));
})

test("noExists return true", () => {
  return user.noExists("coucou@do.do").then(result => expect(result).toBe(true));
});
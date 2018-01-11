const express = require('express')
const model = require('../models/user')
const { checkCredentialsMiddleware } = require("../auth/login");
const { generateToken, checkTokenMiddleware } = require("../auth/jwt");

module.exports = express
  .Router()
  .get("/", (req, res) => {
    model
      .getUsers()
      .then(result => res.json(result))
      .catch(err => res.json(err));
  })
  .post("/", (req, res) => {
    const { lastname, firstname, email, password } = req.body;
    model
      .createUser({ firstname, lastname, email, password })
      .then(result => res.send(result))
      .catch(err => console.log(err));
  })
  /**
   * Move a card
   */
  .put("/:userId/card/:cardId/list", (req, res) => {
    const { userId, cardId } = req.params;
    const { listId } = req.body;
    model
      .setListCard({ userId, cardId, listId })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  })
  /**
   * Add a card to a user
   */
  .post("/:userId/card", (req, res) => {
    const { userId } = req.params;
    const { cardId } = req.body;
    model
      .addCard({ userId, cardId })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  })
  .put("/:id", (req, res) => {
    const { id } = req.params;
    const { firstname, lastname } = req.body;
    model
      .updateUser({ id, firstname, lastname })
      .then(result => res.json(result))
      .catch(err => res.json(err));
  })
  .delete("/:id", (req, res) => {
    const { id } = req.params;
    model
      .deleteUser(id)
      .then(result => res.json(result))
      .catch(err => res.json(err));
  })
  .post("/login", checkCredentialsMiddleware, (req, res) => {
    // ici on appelle checkCredentials
    // checkCredentials(req.body.email, req.body.password)
    // .then( () => res.send('LOGIN REUSSI'))
    // .catch( err => res.send(err))

    // Grâce au middleware checkCredentialsMiddleware, on récupere le user
    res
      .status(200)
      .json({
        token: "JWT " + generateToken(req.user),
        user: {
          id: req.user.id,
          firstName: req.user.firstname,
          lastName: req.user.lastname
        }
      });
  });

  /**
   * Ajouter une route /user/login
   */

  
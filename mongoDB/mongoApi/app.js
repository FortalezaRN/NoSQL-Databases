const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
mongoose.connect('mongodb://localhost:27017/mongoApi', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  const User = new mongoose.Schema({
    nome: String,
    email: String,
    idade: Number
  });
  console.log("tudo certo");

  const Users = mongoose.model('users', User);

  app.post('/user', (req, res) => {
    var userFulano = new Users({
      nome: "Beltrano",
      email: "beltrano@gmail.com",
      idade: 30
    });
    userFulano.save(function (err, userFulano) {
      if (err) return console.error(err);
      console.dir(userFulano);
      res.send(userFulano.nome + " foi adicionado no mongo");
    });
  })

  app.get('/user', (req, res) => {
    Users.find(function (err, users) {
      if (err) return console.error(err);
      console.dir(users);
      res.send(users);
    });
  })

  app.get('/user/:id', (req, res) => {
    const id = req.params.id;
    Users.findById(id, function (err, users) {
      if (err) return console.error(err);
      console.dir(users);
      res.send(users);
    });
  })

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))

});


const express = require('express')
const redis = require('redis')
const cache = redis.createClient()
const app = express()
const port = 3000

cache.on('connect', () => {
  console.log('Redis is ready');
});

cache.on('error', (e) => {
  console.log('Redis error', e);
});

cache.on("message", function (canal, message) {
  console.log(JSON.parse(message).message + ". Essa mensagem veio do canal: " + canal);
});
// cache.subscribe("notificacao");

app.get('/visualizar', (req, res) => {
  cache.llen("Lista", function (err, reply) {
    console.error(err)
    if (reply === 0) {
      console.log("Lista vazia"); //prints 2
      res.send("Lista vazia");
    }
    else {
      console.log("Lista com " + reply + " conteúdos"); //prints 2
      res.send("Lista com " + reply + " conteúdos");
    }
  });
})

app.get('/consumir', (req, res) => {
  cache.blpop("Lista", 5, function (err, reply) {
    if (reply === null)
      res.send("Nenhum dado adicionado");
    else
      res.send("Da " + (reply) + " foi removido");
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const express = require('express')
const redis = require('redis')
const cache = redis.createClient()
const app = express()
const port = 3001

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


app.get('/produzir', (req, res) => {
  cache.llen("Lista", function (err, reply) {
    cache.lpush("Lista", ["conteudo" + reply])
    res.send("conteudo " + (reply + 1) + " foi adicionado");
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
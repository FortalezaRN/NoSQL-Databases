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

app.get('/top10', (req, res) => {
  cache.zrevrange("jogador", 0, 9, 'withscores', (e, reply) => {
    let lista = "";
    reply.forEach((el, i) => {
      if (i % 2 == 0)
        lista += `<li> jogador ${el} `
      else
        lista += ` pontuacao ${el} </li>`
    })
    res.send(`<ul> ${lista} </ul>`)
    console.log(reply)
  })
})

app.get('/add/:id/:pontuacao', (req, res) => {
  const id = req.params.id;
  const pontuacao = req.params.pontuacao;
  cache.zscore("jogador", id, (e, reply) => {
    if (reply == null) {
      cache.zadd("jogador", pontuacao, id)
      res.send(`Jogador ${id} criando com ${pontuacao} de pontuação`)
    } else {
      cache.zincrby("jogador", pontuacao, id, (e, out) => {
        console.log(e, out);
        res.send(`Foi adicionado ${pontuacao} ao jogador ${id} e está com um total de ${out} pontos`)
      })
    }
  })
})
app.get('/remove/:id/:pontuacao', (req, res) => {
  const id = req.params.id;
  const pontuacao = req.params.pontuacao;
  cache.zscore("jogador", id, (e, reply) => {
    if (reply == null) {
      res.send(`Jogador ${id} Não foi criado ainda. Adicione ele.`)
    } else {
      cache.zincrby("jogador", "-" + pontuacao, id, (e, out) => {
        console.log(e, out);
        res.send(`Foi removido ${pontuacao} ao jogador ${id} e está com um total de ${out} pontos`)
      })
    }
  })
})

app.get('/rank/:id', (req, res) => {
  const id = req.params.id;
  cache.zrevrank("jogador", id, (e, reply) => {
    console.log(e, reply)
    if (reply == null) {
      res.send(`Jogador ${id} Não foi criado ainda. Adicione ele.`)
    } else {
      res.send(`Jogador ${id} está na ${(reply + 1)}º posição no rank`)
    }
  })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const redis = require('redis')
const cache = redis.createClient()

// cache.watch("Lista", function (a, b) {
//   console.log(a, b)
// })

cache.publish("notificacao", "{ \"message\": \"A Lista está vazia\" }", function (a, pcs) {
  console.log("A notificação foi enviada para " + pcs + " computadores")
  process.exit(0);
});

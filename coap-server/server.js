var coap        = require('coap')
  , server      = coap.createServer()
 
server.on('request', function(req, res) {
  //console.log(req)
  console.log("OK")
  res.end('yessir miller')
})
 
// the default CoAP port is 5683
server.listen()
console.log("\x1b[33mListening\x1b[0m")
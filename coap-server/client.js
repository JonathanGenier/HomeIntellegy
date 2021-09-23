var coap        = require('coap')
  , server      = coap.createServer()
 
var req = coap.request('coap://localhost/events')
 
  req.on('response', function(res) {
    res.pipe(process.stdout)
    res.on('end', function() {
      process.exit(0)
    })
  })
 
  req.end()
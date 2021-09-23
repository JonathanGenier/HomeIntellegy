const next = require('next')
const express = require('express')
const dev = process.env.NODE_ENV !== 'production'
const next_app = next({ dev })
const handle = next_app.getRequestHandler()
const config = require('./utils/config.json')
const axios = require('axios')

next_app.prepare().then(() => {

    /*======================================================================= 
        SERVER
    =======================================================================*/

    const app = express()
    app.listen(config.port, () => {
        console.log("\x1b[33mListening requests on port", config.port, "\x1b[0m")
    })

    app.all('*', (req, res) => {
        return handle(req, res)
    })

    /*======================================================================= 
        SOCKETS
    =======================================================================*/

    axios.post('http://localhost:8000/api/socketio').then(() => {})
})
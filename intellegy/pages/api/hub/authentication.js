// =======================================================================================
//  Fichier     :   hub/authentication.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes POST lorsqu'un tente de se connecter 
//                  au serveur.  
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'

// URL de la database
const URL = configs.dbAddress + "/api/server"

export default async (req, res) => {
    const { method } = req

    if (method !== 'POST') {
        return res.status(400).json({ result: 'Bad request - Only POST is supported for authentication.' })
    }

    // Data envoyé pour l'authentification
    let data = {
        action: "login",
        serial_number: req.body.serial_number,
        password: req.body.password,
    }

    console.log(data)
    // POST via la database
    axios.post(URL, data).then(response => {
        
        console.log(response)

        // Retourne si on ne recoit pas un status 200
        if (response.status !== 200) {
            let error = "Database returned with status: " + status
            console.log(error)
            return res.status(status).json({ error })
        }

        // Invalid Credentials
        if (response.data.hub.length === 0) {
            return res.status(200).json({ id: -1 })
        }

        let hub = {
            id: response.data.hub[0]._id,
        }

        // Avons nous vraiment besoin d'un JWT?
        // Si oui on devrait penser a faire un REFRESH TOKEN.
        const jwt = sign({hub}, configs.jwt_key, {expiresIn: '1h'})
        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600,
            path: '/'
        }))

        return res.status(200).json({ id: response.data.hub[0]._id })
    }).catch(error => {
        handleError(error)
        return res.status(400)
    })
}

const handleError = error => {
    if (error.code === 'ECONNREFUSED') {
        console.log("\x1b[31mDATABASE SERVER OFFLINE\x1b[0m")
    } else {
        console.log(error)
    }
}
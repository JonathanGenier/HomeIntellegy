// =======================================================================================
//  Fichier     :   user/authentication.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes POST lorsqu'un utilisateur tente de 
//                  s'authentifier.  
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'
import { sign } from 'jsonwebtoken'
import cookie from 'cookie'

// URL de la database
const url = configs.dbAddress + "/api/user"

export default async (req, res) => {
    const { method } = req

    if (method !== 'POST') {
        return res.status(400).json({ result: 'Bad request - Only POST is supported for authentication.' })
    }

    // Data envoyé pour l'authentification
    let data = {
        action: "login",
        username: req.body.username,
        password: req.body.password,
    }

    // POST via la database
    axios.post(url, data).then(response => {

        // Retourne si on ne recoit pas un status 200
        if (response.status !== 200) {
            let error = "Database returned with status: " + status
            console.log(error)
            return res.status(status).json({ error })
        }

        // Invalid Credentials
        if (response.data.user.length === 0) {
            return res.status(200).json({ id: -1 })
        }

        let user = {
            id: response.data.user[0]._id,
            firstName: response.data.user[0].firstName,
            lastName: response.data.user[0].lastName,
            email: response.data.user[0].email,
            country: response.data.user[0].country,
            region: response.data.user[0].region,
            city: response.data.user[0].city,
            address: response.data.user[0].address,
            postalCode: response.data.user[0].postalCode,
            hubs: response.data.user[0].listServers
        }

        const jwt = sign({user}, configs.jwt_key, {expiresIn: '1h'})
        res.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600,
            path: '/'
        }))
        
        return res.status(200).json({ id: response.data.user[0]._id })
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
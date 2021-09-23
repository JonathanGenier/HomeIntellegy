// =======================================================================================
//  Fichier     :   user/registration.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes POST lorsqu'un utilisateur tente de 
//                  s'enregistrer à la base de donnée. 
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'

// URL de la database
const url = configs.dbAddress + "/api/user"

export default async (req, res) => {
    const { method } = req

    if (method !== 'POST') {
        return res.status(400).json({ result: 'Bad request - Only POST is supported for registration.' })
    }

    // Data envoyé pour la création du compte
    let data = {
        action: "register",
        user: {
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,              
            lastName: req.body.lastName,                 
            email: req.body.email,
            country: req.body.country,
            region: req.body.region,
            city: req.body.city,              
            address: req.body.address,        
            postalCode: req.body.postalCode     
        }
    }

    // POST via la database
    await axios.post(url, data).then(response => {
        
        // Retourne si on ne recoit pas un status 201
        if (response.status !== 201) {
            let error = "Database returned with status: " + status
            console.log(error)
            return res.status(status).json({ error })
        }

        return res.status(201).json({ registered: response.data.success })
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
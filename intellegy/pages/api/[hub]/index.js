// =======================================================================================
//  Fichier     :   authentication.js
//  Auteur      :   Alexandre Villeneuve    3/9/2021  Note: Socket
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes GET POST du login et du register.  
// =======================================================================================

import { apiAuthorization } from '../../../modules/authorization'

export default async function handler(req, res) {

    const { method } = req
    console.log("huiofdsahnjuiop")

    switch (method) {
        case 'GET': // If get case is active, security issue not authenticated
            res.status(200).json({ success: true })
            break
        case 'POST':
            res.status(201).json({ success: true })

            break
        default:
            res.status(400).json({ success: false })
            break
    }
}

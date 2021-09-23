// =======================================================================================
//  Fichier     :   hub/registration.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes POST lorsqu'on tente d'enregistrer un hub
//                  à la base de donnée.  
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'
import { apiAuthorization } from '../../../modules/authorization'
// URL de la database
const url = configs.dbAddress + "/api/server"

// Seulement les employés de Home Intellegy (Techniciens) pourront enregistrer un nouveau hub.
// L'enregistrement d'un hub nécessite un SerialNumber et un Mot de passe. 
export default apiAuthorization(async (req, res) => {
    const { method } = req

    if (method !== 'POST') {
        return res.status(400).json({ result: 'Bad request - Only POST is supported for registration.' })
    }

    // Data envoyé pour la création du hub
    let data = {
        action: "register",
        server: {
            name: "New Hub",
            id_list_users: [],
            list_groups: [],
            serial_number: req.body.serial_number,
            password: req.body.password,
            id_list_devices: []
        }
    }

    // POST via la database
    await axios.post(url, data).then(response => {
        console.log('ok', response.status)
        // Retourne si on ne recoit pas un status 201
        if (response.status !== 201) {
            let error = "Database returned with status: " + status
            console.log(error)
            return res.status(status).json({ error })
        }

        return res.status(201).json({ registered: response.data.success })
    }).catch(error => {
        handleError("Hub registration error:", error)
        return res.status(400)
    })
})

const handleError = error => {
    if (error.code === 'ECONNREFUSED') {
        console.log("\x1b[31mDATABASE SERVER OFFLINE\x1b[0m")
    } else {
        console.log(error)
    }
}
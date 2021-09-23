// =======================================================================================
//  Fichier     :   user/authentication.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes POST lorsqu'un utilisateur tente de 
//                  s'authentifier.  
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'
import { apiAuthorization } from '../../../modules/authorization'
import jwt_decode from 'jwt-decode'

// URL de la database

const USER_URL = configs.dbAddress + "/api/user"
const HUB_URL = configs.dbAddress + "/api/server"

// Seulement les employés de Home Intellegy (Techniciens) pourront enregistrer un nouveau hub.
// L'enregistrement d'un hub nécessite un SerialNumber et un Mot de passe. 
export default apiAuthorization(async (req, res) => {
    const { method } = req

    if (method !== 'GET') {
        console.log( 'Bad request - Only GET is supported for user/hubs.')
        return res.status(400).json({ result: 'Bad request - Only POST is supported for user/hubs.' })
    }

    const userId = jwt_decode(req.cookies.auth).user.id

    let hubsId = await getHubsId(userId)
    let hubs = await getHubsData(hubsId)

    console.log("Hubs Array Size:", hubs.length)
    return res.status(200).json({ hubs })
})

const getHubsId = async (userId) => {
    let url = USER_URL + "/" + userId

    const response = await axios.get(url)

    // Retourne si on ne recoit pas un status 200
    if (response.status !== 200) {
        let error = "Database returned with status: " + status
        console.log(error)
        return null
    }

    return response.data.user[0].listServers
}

const getHubsData = async (hubsId) => {
    let hubs = []

    for(let i = 0; i < hubsId.length; i++) {
        let hubId = hubsId[i]
        let url = HUB_URL + "/" + hubId

        const response = await axios.get(url)

        // Retourne si on ne recoit pas un status 200
        if (response.status !== 200) {
            let error = "Database returned with status: " + status
            console.log(error)
            return null
        }

        hubs.push(response.data.hub)
    }

    return hubs
}


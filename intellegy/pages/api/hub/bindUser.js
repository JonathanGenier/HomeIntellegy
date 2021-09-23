// =======================================================================================
//  Fichier     :   hub/authentication.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère la création d'une relation entre un HUB et un USER.
//                  TODO: Beaucoup de ce fichier  devrais être fait sur le côté de la 
//                        base de donnée. On éviterais de faire les requêtes GET 
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'
import { apiAuthorization } from '../../../modules/authorization'
import jwt_decode from 'jwt-decode'

// URL de la database
const HUB_URL = configs.dbAddress + "/api/server"
const USER_URL = configs.dbAddress + "/api/user"

export default apiAuthorization(async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const { method } = req

        if (method !== 'POST') {
            await res.status(400).json({ result: 'Bad request - Only POST is supported for bindUser.' })
            reject()
        }

        // À ce niveau, le user existe certainement et on vérifie déjà
        // s'il existe et authentifier par la fonction (apiAuthorization)
        // Il aura toujours un token existant à ce niveau.
        const token = jwt_decode(req.cookies.auth)
        let userId = token.user.id

        // Recueille les données du user actuel de la database
        let userData = await getUser(userId)
        
        // Si on ne trouve pas le user dans la base de donnée, soit qu'il y ait un changement
        // de id dans son token (token expiré?), ou c'est une erreur imprévu. 
        if (!userData) {
            await res.status(200).json({ success: false, message: "Invalid user credentials" })
            resolve()
        }

        // Recueille les données du hub actuel de la database
        let hubData = await getHub(req.body.serial_number, req.body.password)

        // Si on ne trouve pas le hub dans la base de donnée, soit qu'il n'est pas 
        // enregistrer (faute par un technicien) ou que les données entrée par le user 
        // ne sont pas valide.
        if (!hubData) {
            await res.status(200).json({ success: false, message: "Invalid hub credentials" })
            resolve()
        }

        hubData.name = req.body.name

        // On créer une relation entre le hub et le user
        // On vérifie d'abord s'il y a d'abord une relation avec l'utilisateur 
        if (!hubData.id_list_users.includes(userId)) {
            hubData.id_list_users.push(userId)

            // On met à jour la base de donnée des changements effectués pour le hub.
            if (!await updateHub(hubData)) {
                console.log("Failed to update hub")
                await res.status(200).json({ success: false, message: "Failed to update hub" })
                resolve()
            }
        }

        if (!userData.listServers.includes(hubData._id)) {
            userData.listServers.push(hubData._id)
        
            // On met à jour la base de donnée des changements effectués pour le user.
            if (!await updateUser(userData)) {
                console.log("Failed to update user")
                await res.status(200).json({ success: false, message: "Failed to update user" })
                resolve()
            }
        }

        await res.status(200).json({ success: true })
        return resolve()
    })
})

const getHub = async (serial_number, password) => {
    let data = {
        action: "data",
        serial_number: serial_number,
        password: password
    }

    const response = await axios.post(HUB_URL, data)

    // Retourne si on ne recoit pas un status 200
    if (response.status !== 200) {
        console.log("Database returned with status: " + status)
        return null
    }

    // Invalid Credentials
    if (response.data.hub.length === 0) {
        return null
    }

    return response.data.hub[0]
}

const getUser = async userID => {
    let URL = USER_URL + "/" + userID

    const response = await axios.get(URL)

    // Retourne si on ne recoit pas un status 200
    if (response.status !== 200) {
        console.log("Database returned with status: " + status)
        return null
    }

    // Invalid Credentials
    if (response.data.user.length === 0) {
        return null
    }

    return response.data.user[0]
}

const updateHub = async hub => {
    let URL = HUB_URL + "/" + hub._id
    const response = await axios.put(URL, hub)

    // Retourne si on ne recoit pas un status 200
    if (response.status !== 200) {
        let error = "Database returned with status: " + status
        console.log(error)
        return false
    }

    return response.data.success
}

const updateUser = async user => {
    let URL = USER_URL + "/" + user._id
    const response = await axios.put(URL, user)

    // Retourne si on ne recoit pas un status 200
    if (response.status !== 200) {
        let error = "Database returned with status: " + status
        console.log(error)
        return false
    }

    return response.data.success
}


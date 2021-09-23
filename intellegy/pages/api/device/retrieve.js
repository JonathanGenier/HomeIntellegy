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
const URL = configs.dbAddress + "/api/device"

export default async (req, res) => {
    const { method } = req

    if (method !== 'POST') {
        return res.status(400).json({ result: 'Bad request - Only POST is supported for device/retrieve.js' })
    }

    let devices = []

    console.log("GET DEVICE")
    for (let i = 0; i < req.body.devicesId.length; i++) {
        let device = await getDeviceData(req.body.devicesId[0])
        devices.push(device)
    }

    return res.status(200).json({ devices })
}

const getDeviceData = async deviceId => {

    let DB_URL = configs.dbAddress + "/api/device/" + deviceId
    const response = await axios.get(DB_URL)

    // Retourne si on ne recoit pas un status 201
    if (response.status !== 200) {
        let error = "Database returned with status: " + status
        console.log(error)
        return null
    }

    return response.data.device
}
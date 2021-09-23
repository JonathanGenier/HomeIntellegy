// =======================================================================================
//  Fichier     :   hub/registration.js
//  Auteur      :   Jonathan Génier
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes POST lorsqu'on tente d'enregistrer un hub
//                  à la base de donnée.  
// =======================================================================================

import axios from 'axios'
import configs from '../../../utils/config.json'

// Seulement les employés de Home Intellegy (Techniciens) pourront enregistrer un nouveau hub.
// L'enregistrement d'un hub nécessite un SerialNumber et un Mot de passe. 
export default async (req, res) => {
    const { method } = req

    if (method !== 'POST') {
        return res.status(400).json({ result: 'Bad request - Only POST is supported for registration.' })
    }

    let hub = await getHub()

    if (!hub) {
        console.log("Device creation failed")
        return res.status(201).json({ registered: false })
    }

    let device = await createDevice(hub[0]._id)
    
    if (!device) {
        console.log("Device creation failed")
        return res.status(201).json({ registered: false })
    }

    let isBinded = bindDeviceToHub(hub[0], device._id)

    return res.status(201).json({ registered: isBinded })
}

const createDevice = async (hubId) => {

    // URL de la database pour les devices
    const DEVICE_URL = configs.dbAddress + "/api/device"

    // Data envoyé pour la création du hub
    let data = {
        device: {
            name: "Ultimate Light",
            type_id: "1",
            id_list_group: [],
            log: "The Ultimate Toggle Light",
            id_server: hubId
        }
    }

    const response = await axios.post(DEVICE_URL, data)

    // Retourne si on ne recoit pas un status 201
    if (response.status !== 201) {
        let error = "Database returned with status: " + status
        console.log(error)
        return null
    }

    return response.data.device
}

const getHub = async () => {
    
    let URL = configs.dbAddress + "/api/server"
    let data = {
        action: "dev",
        serial_number: "3f1a761a-622a-40f1-80fa-d37c59b156e8",
        password: "47f1bbc7-d6f5-4e91-a502-d049a81c2b9b"
    }

    const response = await axios.post(URL, data)

    // Retourne si on ne recoit pas un status 201
    if (response.status !== 200) {
        let error = "Database returned with status: " + status
        console.log(error)
        return null
    }

    return response.data.hub
}

const bindDeviceToHub = async (hub, deviceId) => {

    // URL de la database pour les devices
    const DB_URL = configs.dbAddress + "/api/server/" + hub._id
    hub.id_list_devices.push(deviceId)

    const response = await axios.put(DB_URL, hub)

     // Retourne si on ne recoit pas un status 200
     if (response.status !== 200) {
        let error = "Database returned with status: " + status
        console.log(error)
        return false
    }

    return response.data.success
}
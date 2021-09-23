
// Ces données sont déjà enregistrer dans la base de donnée. Ce sont trois hubs valide à utiliser.
// Le dernier hub (3) est utiliser pour tester une mauvaise connection 
// Le serial_number pourra jamais être changer et devra être unique pour chaque hub.
// Le password pourra être changer seulement par le propriétaire.
const serial_number = [
    "5316e58a-c443-4282-bcc6-7a6549a7630a", // 0
    "90d79043-b5ea-4764-bd71-f4f4aeba30b4", // 1
    "d22831dd-894d-4596-b7de-6491d1c4e896", // 2
    "3fa3a69e-c14a-4024-9c72-d8672c763def", // 3    CLEAN
    "TEST"                                  // 4
]

const password = [
    "76847396-3348-4952-9f02-18a46acceb87", // 0
    "ab14fc44-bec9-4f79-8fa9-47b486309267", // 1
    "5d330bbb-7992-4d95-a00a-b6e9a9723012", // 2
    "ac4c64c4-4035-43bf-8029-09c1545b8a68", // 3    CLEAN
    "TEST"                                  // 4
]

// 0, 1, 2, 3 = VALIDE || 4 = INVALIDE
const hubNumber = 1

const {io} = require('socket.io-client')

const connect = async () => {
    const axios = require('axios')

    // TODO:  Encryption du mot de passe
    const url = 'http://localhost:8000/api/hub/authentication'

    let hub = {
        serial_number: serial_number[hubNumber],
        password: password[hubNumber]
    }

    axios.post(url, hub).then(response => {

        if (response.status !== 200) {
            return console.log("Database returned with status: ", status)
        }

        let id = response.data.id

        // Invalid Credentials
        if (id === -1) {
            return console.log("\x1b[31mCONNECTION REFUSED: INVALID CREDENTIALS\x1b[0m")
        }

        // Création d'un socket
        const socket = io('ws://localhost:8000', { auth: { entityType: "HUB", entityId: id } })

        // On attend la confirmation du serveur. Si tous les informations
        // sont valide, on peut assigner un socket à ce client.
        socket.on('conn-confirmation', data => {
            console.log(data)
            socket.emit('conn-confirmation', '\x1b[32mHub [' + id + '] is now connected to the server.\x1b[0m' )
        })

        



    }).catch(error => {
        handleError(error)
    })
}

const handleError = error => {
    if (error.code === 'ECONNREFUSED') {
        console.log("\x1b[31mWEB SERVER OFFLINE\x1b[0m")
    } else {
        console.log(error)
    }
}

connect()





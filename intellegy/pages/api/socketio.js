import { Server } from 'socket.io'
import apiAuthorization from '../../modules/authorization'
import { verify } from 'jsonwebtoken'
import configs from '../../utils/config.json'

const ENTITY_TYPES = ["USER", "HUB"];
const ACTIONS_TYPES = ['NAME', 'STATE']

// FOR IP ADDRESS
//socket.ip = socket.request.connection.remoteAddress
export default function ioHandler(req, res) {
    if (!res.socket.server.io) {
        console.log('*First use, starting socket.io')

        const io = new Server(res.socket.server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"]
            }
        })

        io.hubs = {}

        io.on('connection', socket => {
            //======================================================================================
            //      ON CONNECTION
            //======================================================================================

            // Si on n'a pas le type d'entité, on ne peut pas procédé à la création du socket.
            if (!socket.handshake.auth.entityType) {
                console.log("Entity type is null. Socket intialization aborted.")
                return
            }

            // Si on n'a pas le id de l'utilisateur, on ne peut pas procédé à la création du socket.
            if (!socket.handshake.auth.entityId) {
                console.log("Entity ID is null. Socket intialization aborted.")
                return
            }

            // Si on recoit un mauvais type d'entité, on ne peut pas procédé à la création du socket.
            if (ENTITY_TYPES.indexOf(socket.handshake.auth.entityType.toUpperCase()) == -1) {
                console.log("Unknown entity type (", entityType, "). Socket intialization aborted.")
                return
            }

            // Type l'entité qui tente de se connecter.
            // Est-ce que l'entité est un USER ou un HUB?
            const entityType = socket.handshake.auth.entityType.toUpperCase()

            // ID de l'entité stocker dans la base de donnée.
            // ID du USER ou ID du HUB.
            const entityId = socket.handshake.auth.entityId

            // HUB
            if (entityType === ENTITY_TYPES[1]) {

                io.hubs[entityId] = socket
                //socket.allowedUsers
                console.log("\x1b[32m\x1b[4mSocket initialized for Hub", entityId, "\x1b[0m")
            }

            // USER
            else if (entityType === ENTITY_TYPES[0]) {
                socket.ip = socket.request.connection.remoteAddress
                socket.hub = null;
                console.log("\x1b[32m\x1b[4mSocket initialized for User", entityId, "\x1b[0m")
            }

            // On affiche des messages dans la console afin de confirmer la connection
            socket.emit('conn-confirmation', '\x1b[32mYou are now connected to Intellegy server.\x1b[0m')
            socket.on('conn-confirmation', data => { console.log(data) })
            console.log('Socket connected:', io.engine.clientsCount)

            //======================================================================================
            //      EVENTS
            //======================================================================================

            // SEND
            // ID du device
            // ACTION du device
            // VALUE
            socket.on('update-device', (action, value) => {
                console.log("OK");
                /*let isValid = true
                action = action.toLowerCase()
 
                // Validate action
                if (!validActions.includes(action)) {
                    isValid = false
                    console.log("Invalid action:", action)
                }
 
                // Validate input
                if (isEmpty(value)) {
                    isValid = false
                    console.log("Invalid input: Empty or null")
                }
 
                if (isValid) {
                    let clientServerName = getServerName(socket.handshake.query.socketName) // ID du SERVER du DEVICE
                    let csWs = clients.getClient(clientServerName)
                    try {
                        let bundle = {
                            path: socket.handshake.query.socketName,                        // ID du device
                            action: action,
                            value: value
                        }
 
                        socket.to(csWs.socketId).emit('update-dev', bundle)
                    } catch {
                        if (csWs === undefined) {
                            console.log("Can't connect to client server -- ServerName:", clientServerName,"| Socket:", csWs)
                        } else {
                            console.log("Wrong request. Check both servers for matching requests.")
                        }
                    }
                }*/
            })

            //====================================================================================
        })

        res.socket.server.io = io

    } else {
        console.log('socket.io already running')
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}


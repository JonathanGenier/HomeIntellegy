import { verify } from 'jsonwebtoken'
import configs from '../utils/config.json'

const authorization = {

    // Vérifie si un utilisateur est connecter via un JWT. Si l'utilisateur n'est
    // pas connecter, il n'aura pas la permission d'accèder à la page qu'il tente d'aller.
    clientAuthorization: ({ req, res }) => {
        try {
            let token = verify(req.cookies.auth, configs.jwt_key)
            if (token.user) return { props: { user: token.user } }
        } catch (error) {
            //console.log("modules/authorization.js : ERROR", error)
        }

        res.statusCode = 302
        res.setHeader("Location", `/login`)
    },

    // Vérifie si un utilisateur est connecter via un JWT. Si l'utilisateur n'est
    // pas connecter, il n'aura pas la permission d'accèder à l'API.
    apiAuthorization: fn => async (req, res) => {
        verify(req.cookies.auth, configs.jwt_key, async function (err, decoded) {
            if (!err && decoded) {
                return await fn(req, res)
            }
            console.log("Permission Denied")
            res.status(401).json({ message: 'Permission Denied' })
        })
    },
}

module.exports = authorization;
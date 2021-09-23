// =======================================================================================
//  Fichier     :   authentication.js
//  Auteur      :   Alexandre Villeneuve    3/9/2021  Note: Socket
//  Modifié par :   
//  Description :   Ce fichier gère les requêtes GET POST du login et du register.  
// =======================================================================================

// One device at a time
export default async (req, res) => {
    const { method } = req
    console.log("POPOPOPPSFDSDFDS")
    switch (method) {
        case 'POST':
            break
        case 'PUT':
            res.status(200).json({ result: 'PUT IT IN' })
            break
        default:
            res.status(400).json({ result: 'Bad request' })
            break
    }
}
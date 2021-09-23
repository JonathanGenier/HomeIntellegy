const assert = require("assert");
const conn = require("mongoose");
const DB_NAME = 'Intelligi';
const DEVICES_COLLECTION = "Devices";
const SERVERS_COLLECTION = 'Servers';
const TYPES_COLLECTION = 'Types';
const USERS_COLLECTION = 'Users';
const url = "mongodb+srv://Admin:IntelligiAdmin@cluster0.imcw0.mongodb.net/Intelligi?retryWrites=true&w=majority";  //a modifier pour la bonne adresse de la DB mongo
let connection;

function initDb(callback) {
    conn.set('useCreateIndex', true);
    conn.connect(url, {useNewUrlParser: true}).catch(error=>{
        console.log(error);
    });
    
    connection = conn.connection;
    connection.on('error', console.error.bind(console, 'Erreur de connexion:'));
    connection.once('open', function() {
        console.log(`Connextion a "${DB_NAME}" @ ${url} cree`);
        return callback(null, connection);  
    });
}

function getDb() {
    assert.ok(connection, "La base de donnee n'a pas ete initialisee, veuiller appeler init.");
    return connection;
}

module.exports = {
    getDb,
    initDb,
    DB_NAME,
    DEVICES_COLLECTION,
    SERVERS_COLLECTION,
    USERS_COLLECTION,
    TYPES_COLLECTION
};
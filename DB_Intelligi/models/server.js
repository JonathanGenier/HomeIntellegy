const { Int32 } = require('bson');
const mongoose = require('mongoose');

const MODEL_NAME = "Server"
const COLLECTION_NAME = "Servers";
var Model;

var Server = new mongoose.Schema({
    id:{type:String, required:false},
    name:{type:String, required:true},
    id_list_users:{type:[String], required:false},
    list_groups:{type:[{
        name:{type:String, required:true},
        id:{type:String, required:false},
        id_list_devices:{type:[String], required:false}
    }], required:false},
    serial_number:{type:String, required:true},
    password:{type:String, requires:true},
    id_list_devices:{type:[String], required:false}
});
    Model = mongoose.model(MODEL_NAME, Server, COLLECTION_NAME);

module.exports = {
    Model,
    COLLECTION_NAME,
    MODEL_NAME,
    Server
}; 


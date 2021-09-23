const mongoose = require('mongoose');

const MODEL_NAME = "Device"
const COLLECTION_NAME = "Devices";
var Model;

var Device = new mongoose.Schema({
    name:{type:String, required:true},
    id:{type:String, required:false},
    type_id:{type:String, required:false},
    id_list_group:{type:[String], required:false},
    log:{type:[String], required:true},
    id_server:{type:String, required:true}
});
    Model = mongoose.model(MODEL_NAME, Device, COLLECTION_NAME);

module.exports = {
    Model,
    COLLECTION_NAME,
    MODEL_NAME,
    Device
}; 
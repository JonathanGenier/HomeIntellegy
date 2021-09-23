const mongoose = require('mongoose');

const MODEL_NAME = "Type"
const COLLECTION_NAME = "Types";
var Model;

var Type = new mongoose.Schema({
    name:{type:String, required:true},
    id:{type:String, required:false},
    img_path:{type:String, required:true}
});
    Model = mongoose.model(MODEL_NAME, Type, COLLECTION_NAME);

module.exports = {
    Model,
    COLLECTION_NAME,
    MODEL_NAME,
    Type
}; 
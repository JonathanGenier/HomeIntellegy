const mongoose = require('mongoose');

const MODEL_NAME = "User"
const COLLECTION_NAME = "Users";
var Model;

var User = new mongoose.Schema({
    username:{type:String, required:true},
    password:{type:String, required:true},
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, required:true},
    country:{type:String, required:true},
    region:{type:String, required:true},
    city:{type:String, required:true},
    address:{type:String, required:true},
    postalCode:{type:String, required:true},
    listServers:[{ type: String, required: false }],
    id:{type:String, required:false}
});
    Model = mongoose.model(MODEL_NAME, User, COLLECTION_NAME);

module.exports = {
    Model,
    COLLECTION_NAME,
    MODEL_NAME,
    User
}; 


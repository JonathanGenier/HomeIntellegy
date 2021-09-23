"use strict"
const router = require('express').Router();
const bodyParser = require('body-parser');
const headers = require('../utils/headers');
const errorBuilder = require('../utils/error-builder');
const User = require("../models/user").Model;
const COLLECTION = require("../models/user").COLLECTION_NAME;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// get mongoose
/*router.get('/', async (request, response) => {
    headers.generateHeaders(response);
    try {
        var results;
        results = await User.find().exec();
        results.message = 'success';
        response.status(200);
        response.send({results});
    } 
    catch (error) {
        errorBuilder.createResponse(response, error, COLLECTION);
        response.send(error);
    } 
    finally  {
    }   
});*/

router.get('/hubsFromUser/:id', async (request, response) => {
    console.log("GET USER: ", request.params.id)
    headers.generateHeaders(response);
    try {
        let user = await User.find({ _id: request.params.id}).exec();
        response.status(200).json({user})
    } 
    catch (error) {
        errorBuilder.createResponse(response, error, COLLECTION);
        response.send(error);
    } 
    finally  {
    }  
});

// get by id mongoose                         /////IN THE WORKS
router.get('/:id', async (request, response) => {
    console.log("GET USER: ", request.params.id)
    headers.generateHeaders(response);
    try {
        let user = await User.find({ _id: request.params.id}).exec();
        response.status(200).json({user})
    } 
    catch (error) {
        errorBuilder.createResponse(response, error, COLLECTION);
        response.send(error);
    } 
    finally  {
    }  
});

// post mongoose
router.post('/', async (request, response) => {
    console.log(request.body.action, "user")
    headers.generateHeaders(response);
    try {
        if(request.body.action=="register"){
            let user = new User(request.body.user);
            await user.save();


            // Si le Username existe pas dans la DB, success = true
            response.status(201).json({ success: true }) 

            // Sinon success = false
            //response.status(201).json({ success: false }) 
        }
        else{
            let user = await User.find({ username: request.body.username, password: request.body.password }).exec();
            response.status(200).json({ user })
        }
    } 
    catch (error) {
        errorBuilder.createResponse(response, error, COLLECTION);
        response.send(error);
    } 
    finally {
    };
});

//update mongoose
router.put('/:id', async (request, response) => {
    console.log("Update user: ", request.params.id)
    headers.generateHeaders(response);
    try {
        console.log("PUT RECEIVED")
        var results = await User.updateOne( 
            { _id: request.params.id },
            { $set: request.body }, 
            { runValidators: true }
        ).exec();
        if (!results.n) {
            response.status(200).json({success: false});
        } else {
            response.status(200).json({success: true})
        }
        
        /*else {
            results = await User.findOne({ _id: request.params.id }).exec();
            results = JSON.parse(JSON.stringify(results));
            results.message = 'success';
            response.status(200);
            response.send(results);
        }*/
    } 
    catch (error) {
        errorBuilder.createResponse(response, error, COLLECTION);
        response.send(error);
    } 
    finally {
    };
});

//delete mongoose
router.delete('/:id', async (request, response) => {
    console.log("Delete user: ", request.params.id)
    headers.generateHeaders(response);
    try {
        var results = await User.deleteOne({ _id: request.params.id }).exec();
        if (!results.n) {
            response.status(404);
            response.send({ message: "failed"});
        } 
        else {
            response.status(204);
            response.send({ message: "success"});
        }
    } 
    catch (error) {
        errorBuilder.createResponse(response, error, COLLECTION);
        console.log(error)
        response.send(error);
    } 
    finally {
    };
});

module.exports = router;

//    ლ(⁰⊖⁰ლ)
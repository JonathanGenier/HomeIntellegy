"use strict"
const router = require('express').Router();
const bodyParser = require('body-parser');
const headers = require('../utils/headers');
const errorBuilder = require('../utils/error-builder');
const Server = require("../models/server").Model;
const COLLECTION = require("../models/server").COLLECTION_NAME;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// get mongoose
router.get('/', async (request, response) => {
    console.log("Get hub")
    headers.generateHeaders(response);
    try {
        var results;
        results = await Server.find().exec();
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
});

// get by id mongoose
router.get('/:id', async (request, response) => {
    console.log("Get hub:", request.params.id)
    headers.generateHeaders(response);
    try {
        let hub = await Server.find({ _id: request.params.id }).exec();
        response.status(200).json({ hub })
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
    console.log(request.body.action, "hub")
    headers.generateHeaders(response);
    try {
        if(request.body.action=="register"){
            var server = new Server(request.body.server);
            await server.save();
            console.log("Register Received")
            return response.status(201).json({ success: true }) 
        }
        else{
            var hub = await Server.find({ serial_number: request.body.serial_number, password: request.body.password }).exec();
            response.status(200).json({ hub })

            // Je dois toujours recevoir un status OK (200) sinon, cela crash le website.
            // Je peux déterminer si l'authentification à réussi si je recoit les détails du hub.
            // Si je recois rien, alors l'authentification n'a pas réussi.
            /* 
            if (!results.n) {
                response.status(404);
                response.send({ message: "Serial number or password does not match"});
            } 
            else {
                response.status(200);
                response.send({results});
            }
            */
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
    console.log("Update hub", request.params.id)
    headers.generateHeaders(response);
    try {
        console.log("PUT RECEIVED")
        var results = await Server.updateOne( 
            { _id: request.params.id },
            { $set: request.body }, 
            { runValidators: true }
        ).exec();
        if (!results.n) {
            response.status(200).json({success: false});
        } else {
            response.status(200).json({success: true})
        }

        // ? Je ne comprend cette partie
        /*
        else {
            results = await Server.findOne({ _id: request.params.id }).exec();
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
    console.log("Delete hub", request.params.id)
    headers.generateHeaders(response);
    try {
        var results = await Server.deleteOne({ _id: request.params.id }).exec();
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
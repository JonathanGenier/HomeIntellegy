"use strict"
const router = require('express').Router();
const bodyParser = require('body-parser');
const headers = require('../utils/headers');
const errorBuilder = require('../utils/error-builder');
const Type = require("../models/type").Model;
const COLLECTION = require("../models/type").COLLECTION_NAME;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// get mongoose
router.get('/', async (request, response) => {
    headers.generateHeaders(response);
    try {
        var results;
        results = await Type.find().exec();
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

// post mongoose
router.post('/', async (request, response) => {
    headers.generateHeaders(response);
    try {
        var type = new Type(request.body);
        var results = await type.save();
        results = JSON.parse(JSON.stringify(results));
        results.message = 'success';
        response.status(201);
        response.send(results);
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
    headers.generateHeaders(response);
    try {
        var results = await Type.updateOne( 
            { _id: request.params.id },
            { $set: request.body }, 
            { runValidators: true }
        ).exec();
        if (!results.n) {
            response.status(404);
            response.send({ message: "failed" });
        } 
        else {
            results = await Type.findOne({ _id: request.params.id }).exec();
            results = JSON.parse(JSON.stringify(results));
            results.message = 'success';
            response.status(200);
            response.send(results);
        }
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
    headers.generateHeaders(response);
    try {
        var results = await Type.deleteOne({ _id: request.params.id }).exec();
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
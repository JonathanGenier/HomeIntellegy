"use strict"
const router = require('express').Router();
const bodyParser = require('body-parser');
const headers = require('../utils/headers');
const errorBuilder = require('../utils/error-builder');
const Device = require("../models/device").Model;
const COLLECTION = require("../models/device").COLLECTION_NAME;
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// get mongoose
router.get('/:id', async (request, response) => {
    console.log("Get device:" + request.params.id)
    headers.generateHeaders(response);
    try {
        let device = await Device.find({ _id: request.params.id }).exec();
        response.status(200).json({ device })
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
    console.log("Device created:", request.body.device)

    headers.generateHeaders(response);
    try {
        let device = new Device(request.body.device);
        await device.save();
        response.status(201).json({ device })
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
        var results = await Device.updateOne( 
            { _id: request.params.id },
            { $set: request.body }, 
            { runValidators: true }
        ).exec();
        if (!results.n) {
            response.status(404);
            response.send({ message: "failed" });
        } 
        else {
            results = await Device.findOne({ _id: request.params.id }).exec();
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
        var results = await Device.deleteOne({ _id: request.params.id }).exec();
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
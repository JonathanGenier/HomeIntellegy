"use strict"

// const Audit = require("../models/audit").Model;
const logLevels = require("./log-levels")

/**
 * Log http request to database
 * @param {Request} request 
 * @param {Response} response 
 * @param {String} dbUser
 */
async function log(request, response, dbUser){
    try {
        var audit = new Audit();
        if (response.statusCode == 304) response.status(200);
        audit.Level = logLevels.getLogLevel(response.statusCode);
        audit.httpRequest = `${request.protocol}://${request.hostname}${request.originalUrl}`;
        audit.httpMethod = request.method;
        audit.responseStatus = response.statusCode;
        audit.user = dbUser;
        audit.ip = (
            request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            request.socket.remoteAddress ||
            request.connection.socket.remoteAddress
        );
        let current_datetime = new Date();
        let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " T " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds();
        audit.date = formatted_date;
        audit.correlationId = response.get('X-API-Correlation-Id');
        audit.save();
    } catch (error) {
        throw error;
    }
}

module.exports = { log }

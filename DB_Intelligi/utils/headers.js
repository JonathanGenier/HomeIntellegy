"use strict"

const uuidv1 = require('uuid/v1');

/**
 * Modify response headers
 * @param {Response} response 
 */
function generateHeaders(response) {
    /// GUID Header and clean up leaky header ///
    var correlationId = uuidv1();
    response.set('X-API-Correlation-Id',correlationId);
    response.removeHeader('X-Powered-By');  
}

module.exports = { generateHeaders };

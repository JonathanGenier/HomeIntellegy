

/**
 * Log http request to database
 * @param {Response} response 
 * @param {Error} error 
 */
function createResponse(response, error, collection_name) {
    let errorObj = Object();
    errorObj.code = error.name;
    errorObj.target = collection_name;
    switch (error.name) {
        case "ValidationError": // mongoose error
            errorObj.message = error.message; 
            errorObj.details = error.errors; 
            response.status(400); 
            break;
        case "MongoError": // mongo error
            errorObj.message = error.errmsg;
            if (error.code == 11000) {
                response.status(400);
            } else {
                response.status(500);
            } 
            break;
        default: // other
            errorObj.message = error.message;  
            response.status(500);
            throw error; 
    }

    // replace error object with custom object
    for (const prop of Object.getOwnPropertyNames(error)) {
        delete error[prop];
    }
    Object.assign(error, errorObj);
}

module.exports = { createResponse }
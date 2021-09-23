"use strict"

/**
 * Create custom HATEOS links using this format: `[ [href, rel, method ], ... ]`
 * @param {string[][]} inputLinks 
 */
function createCustom(inputLinks) {
    var outputLinks = [];
    inputLinks.forEach(link => {
        outputLinks.push( { 
            href: link[0],
            rel: link[1],
            method: link[2]
        });
    });
    return outputLinks
}

/**
 * Create default single HATEOS link
 * @param {Request} request 
 */
function createDefaultRetrieval(request) {
    return createCustom([ [ `${request.protocol}://${request.get('Host')}${request.originalUrl}`, "self", request.method ] ]);
}

/**
 * Create default single HATEOS link for PUT, POST or DELETE
 * @param {Request} request 
 * @param {string} collection_name 
 * @param {any} id 
 */
function createDefaultUpdate(request, collection_name, id) {
    let post_id = request.method == "POST" ? `/${id}` : "" ;
    return createCustom([
        [ 
            `${request.protocol}://${request.get('Host')}${request.originalUrl}${post_id}`,
            `${collection_name}-${request.method.toLocaleLowerCase()}`,
            request.method 
        ] 
    ]);
}

module.exports = { createCustom, createDefaultRetrieval, createDefaultUpdate } 

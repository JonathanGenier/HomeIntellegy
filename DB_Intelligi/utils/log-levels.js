const LOG_DEBUG = 'DEBUG';
const LOG_INFO = 'INFO';
const LOG_WARN = 'WARN';
const LOG_ERROR = 'ERROR';
const LOG_FATAL = 'FATAL';

/**
 * Gets the log level based on the status code
 * @param {Number} code 
 */
function getLogLevel(code){
    switch (code) {
        case 0: case null:
            return LOG_DEBUG;
        case 200 : case 201 : case 204: case 304:
            return LOG_INFO;
        case 404: 
            return LOG_WARN;
        case 500:
            return LOG_FATAL;
        default:
            return LOG_ERROR;
    }
}

module.exports = {
    LOG_DEBUG,
    LOG_INFO,
    LOG_WARN,
    LOG_ERROR,
    LOG_FATAL,
    getLogLevel
};


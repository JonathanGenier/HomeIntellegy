let url;
switch (process.env.ENVIRONMENT) {
    case "DEV":
        url = process.env.DF_URL_DEV; break;
    case "CSCDEV":
        url = process.env.DF_URL_CSCDEV; break;
    case "PROD":
        url = process.env.DF_URL_PROD; break;
        
}
//String splitting to extract atlas user credentials from connection string 
var splitString = url.split('//');
var splitString2 = splitString[1].split(':');
var splitString3 = splitString2[1].split('@');


var username = splitString2[0];
var password = splitString3[0];


module.exports = {
    username,
    password
}
var ActiveDirectory = require('activedirectory');
var config = { 
  url: process.env.AD_LDAP,
  baseDN: process.env.AD_BASE_DN,
  username: process.env.AD_USERNAME,
  password: process.env.AD_PASSWORD
}
var ad = new ActiveDirectory(config);

function getAD() {
  return ad;
}

module.exports = {
  getAD
};

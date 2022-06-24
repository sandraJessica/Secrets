const crypto = require("crypto");

//To Do

function genPassword(password) {

  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

  return {
    salt: salt,
    hash: genHash
  };
}


function validPassword(password, salt, hash) {

  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

  return hash === hashVerify;

}


module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;

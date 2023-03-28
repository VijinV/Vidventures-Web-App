const Cryptr = require('cryptr');
const cryptr = new Cryptr('ReallySecretKey');

const encryptedString = cryptr.encrypt('price_1MqE7PSFyX3NIqQBeNLMopLk');
const decryptedString = cryptr.decrypt(encryptedString);

console.log(encryptedString);
console.log(decryptedString);
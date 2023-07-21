const CryptoJS = require('crypto-js');
function encryptMessage(message) {
    const encrypted = CryptoJS.AES.encrypt(message, 'encryption-secret-key').toString();
    return encrypted;
  }
  
  function decryptMessage(encryptedMessage) {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, 'encryption-secret-key');
    const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return decryptedMessage;
  }
  module.exports={encryptMessage,decryptMessage}
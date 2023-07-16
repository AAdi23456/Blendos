const crypto = require('crypto');

// Function to generate a pair of RSA keys
function generateRSAKeys() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
}

// Encrypt a message using the recipient's public key
function encryptMessage(message, publicKey) {
  const buffer = Buffer.from(message, 'utf8');
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
}

// Decrypt an encrypted message using the recipient's private key
function decryptMessage(encryptedMessage, privateKey) {
  const buffer = Buffer.from(encryptedMessage, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
}

// Example usage
const recipientKeyPair = generateRSAKeys();
const senderKeyPair = generateRSAKeys();

const message = 'Hello, this is a secret message!';

// Encrypt the message using the recipient's public key
const encryptedMessage = encryptMessage(message, recipientKeyPair.publicKey);

console.log('Encrypted Message:', encryptedMessage);

// Decrypt the message using the recipient's private key
const decryptedMessage = decryptMessage(encryptedMessage, recipientKeyPair.privateKey);

console.log('Decrypted Message:', decryptedMessage);

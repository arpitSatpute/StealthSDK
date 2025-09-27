require('dotenv').config();
const ethers = require('ethers');
const crypto = require('crypto');
const secrets = require('secrets.js-grempe');


function generateTransactionId(sender, receiver, amount) {
  // Validate inputs
  if (!ethers.utils.isAddress(sender)) {
    throw new Error('Invalid sender address');
  }
  if (!ethers.utils.isAddress(receiver)) {
    throw new Error('Invalid receiver address');
  }
  if (isNaN(amount) || amount < 0) {
    throw new Error('Invalid amount');
  }

  // Generate a random 32-byte AES key
  const encryptionKey = crypto.randomBytes(32);
  const keyHex = encryptionKey.toString('hex');

  // Format inputs as JSON
  const data = JSON.stringify({ sender, receiver, amount: amount.toString() });

  // Encrypt using AES-256-CTR
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-ctr', encryptionKey, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const txId = iv.toString('hex') + encrypted;

  // Generate bytes32 version for on-chain use
  const txIdBytes32 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(txId));

  // Split the encryption key into 3 shares with a threshold of 2
  const keyShares = secrets.share(keyHex, 3, 2); // 3 shares, 2 required

  console.log(`Generated Transaction ID: ${txId}`);
  console.log(`Transaction ID (bytes32): ${txIdBytes32}`);
  console.log(`Key Shares:`, keyShares);

  return { txId, txIdBytes32, keyShares };
}

/**
 * Decrypt a transaction ID using any 2 of the 3 key shares.
 * @param {string} txId - The encrypted transaction ID.
 * @param {string[]} keyShares - At least 2 key shares.
 * @returns {Object} - { sender: string, receiver: string, amount: string }
 */
function decryptTransactionId(txId, keyShares) {
  if (!txId || typeof txId !== 'string' || txId.length < 32) {
    throw new Error('Invalid transaction ID');
  }
  if (!Array.isArray(keyShares) || keyShares.length < 2) {
    throw new Error('At least 2 key shares are required');
  }

  // Reconstruct the AES key from at least 2 shares
  let encryptionKey;
  try {
    encryptionKey = secrets.combine(keyShares);
  } catch (error) {
    throw new Error('Failed to reconstruct key: Invalid shares');
  }

  // Extract IV (first 32 chars) and encrypted data
  const iv = Buffer.from(txId.slice(0, 32), 'hex');
  const encryptedData = txId.slice(32);

  // Decrypt using AES-256-CTR
  try {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(encryptionKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const { sender, receiver, amount } = JSON.parse(decrypted);
    return { sender, receiver, amount };
  } catch (error) {
    throw new Error('Decryption failed: Invalid key or data');
  }
}

module.exports = { generateTransactionId, decryptTransactionId };
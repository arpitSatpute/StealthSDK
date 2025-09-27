// Load environment variables from .env file
require('dotenv').config();

// Import ethers.js for blockchain interactions
const ethers = require('ethers');

// Import generateTransactionId from your txnIdGenerator.js file
const { generateTransactionId } = require('./txnIdGenerator');


async function sendTxIdOnChain(sender, receiver, amount, fragmentManagerAddress, poolAddress, tokenAddress, isDeposit = true, level = 1) {
  try {
    // Validate inputs
    if (!ethers.utils.isAddress(sender)) throw new Error('Invalid sender address');
    if (!ethers.utils.isAddress(receiver)) throw new Error('Invalid receiver address');
    if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');
    if (isDeposit && (level < 1 || level > 4)) throw new Error('Level must be 1-4');

    // Generate a single transaction ID for the total amount (for deposits only)
    let txId, txIdBytes32, keyShares, transactionHash;
    let amounts = [Number(amount)];
    if (isDeposit) {
      const result = generateTransactionId(sender, receiver, Number(amount));
      txId = result.txId;
      txIdBytes32 = result.txIdBytes32;
      keyShares = result.keyShares;
      console.log(`Transaction ID: ${txId}, bytes32: ${txIdBytes32}, Key Shares:`, keyShares);
      amounts = Array(level).fill(Number(amount) / level);
    }

    // Connect to the blockchain using an HTTP RPC provider
    // REPLACE: Set RPC_URL in .env with your provider URL (e.g., https://sepolia.infura.io/v3/your-infura-key)
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    // Initialize wallet using private key from .env
    // REPLACE: Set PRIVATE_KEY in .env with your wallet's private key (must have ETH and PYUSD tokens)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Define ABIs
    const fragmentManagerAbi = [
      "function depositFragments(uint256[] calldata amounts, address stealthAddress, uint256 level, bytes32 txId) external",
      "event FragmentsDeposited(address indexed stealthAddress, uint256[] amounts, uint256 level, bytes32 indexed txId)",
      "function getDepositByTxId(address stealthAddress, bytes32 txId) external view returns (uint256)"
    ];
    const poolAbi = [
      "function deposit(uint256 amount, address stealthAddress, bytes32 txId) external",
      "function withdraw(address stealthAddress) external",
      "event Deposited(address indexed stealthAddress, uint256 amount, bytes32 indexed txId)",
      "event Withdrawn(address indexed stealthAddress, uint256 amount)"
    ];
    const tokenAbi = ["function approve(address spender, uint256 amount) external returns (bool)"];

    // Initialize contracts
    // REPLACE: Ensure fragmentManagerAddress, poolAddress, and tokenAddress are valid
    const fragmentManager = new ethers.Contract(fragmentManagerAddress, fragmentManagerAbi, wallet);
    const poolContract = new ethers.Contract(poolAddress, poolAbi, wallet);
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

    // Convert amounts to wei (VUSDTToken uses 18 decimals)
    const amountWei = amounts.map(a => ethers.utils.parseUnits(a.toString(), 18));

    let tx, receipt;
    if (isDeposit) {
      // Approve FragmentManager to spend total tokens
      const totalWei = amountWei.reduce((sum, a) => sum.add(a), ethers.BigNumber.from(0));
      tx = await tokenContract.approve(fragmentManagerAddress, totalWei);
      await tx.wait();
      console.log(`Approved ${ethers.utils.formatUnits(totalWei, 18)} PYUSD for FragmentManager`);

      // Call depositFragments with single txId
      tx = await fragmentManager.depositFragments(amountWei, receiver, level, txIdBytes32);
      receipt = await tx.wait();
      console.log(`Deposited fragments with txIdBytes32: ${txIdBytes32}`);
      transactionHash = receipt.transactionHash;
    } else {
      // Call withdraw on PoolContract (no txId)
      // REPLACE: Ensure receiver has a deposit in poolAddress and WITHDRAW_DELAY_BLOCKS (5 blocks) is met
      tx = await poolContract.withdraw(receiver);
      receipt = await tx.wait();
      console.log(`Withdrawn ${amount} PYUSD to ${receiver}`);
      transactionHash = receipt.transactionHash;
    }

    return isDeposit
      ? { txId, txIdBytes32, keyShares, transactionHash }
      : { transactionHash };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Export the function
module.exports = { sendTxIdOnChain };
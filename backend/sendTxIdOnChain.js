// Load environment variables from .env file
require('dotenv').config();


const ethers = require('ethers');


const { generateTransactionId } = require('./txnIdGenerator');


 
async function sendTxIdOnChain(sender, receiver, amount, fragmentManagerAddress, poolAddress, tokenAddress, isDeposit = true, level = 1) {
  try {
    // Validate inputs
    // UPDATE: Removed userId parameter and validation, added level validation to support FragmentManager
    if (!ethers.utils.isAddress(sender)) throw new Error('Invalid sender address');
    if (!ethers.utils.isAddress(receiver)) throw new Error('Invalid receiver address');
    if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount');
    if (isDeposit && (level < 1 || level > 4)) throw new Error('Level must be 1-4');

    // Generate transaction IDs (one per fragment for deposits)
    // UPDATE: Modified to generate multiple txIds for deposits based on level, aligning with FragmentManager's fragment-based deposits
    const amounts = isDeposit ? Array(level).fill(Number(amount) / level) : [Number(amount)];
    const txIds = [];
    const txIdBytes32s = [];
    const keyShares = [];
    for (let i = 0; i < amounts.length; i++) {
      const { txId, txIdBytes32, keyShares: shares } = generateTransactionId(sender, receiver, amounts[i]);
      txIds.push(txId);
      txIdBytes32s.push(txIdBytes32);
      keyShares.push(shares);
      console.log(`Fragment ${i + 1} - Transaction ID: ${txId}, bytes32: ${txIdBytes32}, Key Shares:`, shares);
    }

    // Connect to the blockchain using an HTTP RPC provider
    // REPLACE: Set RPC_URL in .env with your provider URL (e.g., https://sepolia.infura.io/v3/your-infura-key)
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

    // Initialize wallet using private key from .env
    // REPLACE: Set PRIVATE_KEY in .env with your wallet's private key (must have ETH and PYUSD tokens)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Define ABIs
    // UPDATE: Updated poolAbi to match modified PoolContract (stealthAddress, txId) and added fragmentManagerAbi to support FragmentManager.depositFragments
    const fragmentManagerAbi = [
      "function depositFragments(uint256[] calldata amounts, address stealthAddress, uint256 level, bytes32[] calldata txIds) external",
      "event FragmentsDeposited(address indexed stealthAddress, uint256[] amounts, uint256 level, bytes32[] txIds)"
    ];
    const poolAbi = [
      "function withdraw(address stealthAddress, bytes32 txId) external",
      "event Withdrawn(address indexed stealthAddress, uint256 amount, bytes32 indexed txId)"
    ];
    const tokenAbi = ["function approve(address spender, uint256 amount) external returns (bool)"];

    // Initialize contracts
    // REPLACE: Ensure fragmentManagerAddress, poolAddress, and tokenAddress are valid
    const fragmentManager = new ethers.Contract(fragmentManagerAddress, fragmentManagerAbi, wallet);
    const poolContract = new ethers.Contract(poolAddress, poolAbi, wallet);
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

    // Convert amounts to wei (VUSDTToken uses 18 decimals)
    // UPDATE: Explicitly set to 18 decimals for PYUSD, matching VUSDTToken
    const amountWei = amounts.map(a => ethers.utils.parseUnits(a.toString(), 18));

    let tx, receipt;
    if (isDeposit) {
      // Approve FragmentManager to spend total tokens
      // UPDATE: Changed to approve FragmentManager instead of PoolContract, aligning with FragmentManager's role in deposits
      const totalWei = amountWei.reduce((sum, a) => sum.add(a), ethers.BigNumber.from(0));
      tx = await tokenContract.approve(fragmentManagerAddress, totalWei);
      await tx.wait();
      console.log(`Approved ${ethers.utils.formatUnits(totalWei, 18)} PYUSD for FragmentManager`);

      // Call depositFragments
      // UPDATE: Changed from PoolContract.deposit to FragmentManager.depositFragments to support fragment-based deposits with txIds
      tx = await fragmentManager.depositFragments(amountWei, receiver, level, txIdBytes32s);
      receipt = await tx.wait();
      console.log(`Deposited fragments with txIdBytes32s:`, txIdBytes32s);
    } else {
      // Call withdraw on PoolContract
      // UPDATE: Updated to match modified PoolContract.withdraw (stealthAddress, txId), removing userId
      // REPLACE: Ensure receiver has a deposit in poolAddress and WITHDRAW_DELAY_BLOCKS (5 blocks) is met
      tx = await poolContract.withdraw(receiver, txIdBytes32s[0]);
      receipt = await tx.wait();
      console.log(`Withdrawn ${amount} PYUSD to ${receiver} with txIdBytes32: ${txIdBytes32s[0]}`);
    }

    return { txIds, txIdBytes32s, keyShares, transactionHash: receipt.transactionHash };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

// Export the function
module.exports = { sendTxIdOnChain };
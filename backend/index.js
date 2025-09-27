require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendTxIdOnChain } = require('./sendTxIdOnChain');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/transact', async (req, res) => {
  try {
    const { sender, receiver, amount, isDeposit, level } = req.body;
    const result = await sendTxIdOnChain(
      sender,
      receiver,
      amount,
      process.env.REACT_APP_FRAGMENT_MANAGER_ADDRESS,
      process.env.REACT_APP_POOL_A_ADDRESS, // Default to poolA for withdrawals; adjust as needed
      process.env.REACT_APP_TOKEN_ADDRESS,
      isDeposit,
      level
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
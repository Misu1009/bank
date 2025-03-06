// Import dependencies
const {Web3} = require("web3");
const BankContractJSON = require("./build/contracts/Bank.json");

// Connect to the local blockchain (Ganache)
const web3 = new Web3("http://127.0.0.1:8545"); // URL Ganache

// Contract address and ABI
const contractAddress = "0x369ef2c7f508320cd9b2c814945c6d95a4a63c95"; // Ganti dengan alamat kontrak Anda
const abi = BankContractJSON.abi;

// Create a contract instance
const bankContract = new web3.eth.Contract(abi, contractAddress);

// Utility function to get accounts from Ganache
async function getAccounts() {
  return await web3.eth.getAccounts();
}

// Function to register a new customer
async function registerCustomer(account, name) {
  console.log(`Registering customer: ${name} with account: ${account}`);
  const tx = await bankContract.methods.register_customer(name).send({ from: account });
  console.log("Customer registered:", tx);
}

// Function to deposit funds
async function deposit(account, amount) {
  console.log(`Depositing ${amount} wei from account: ${account}`);
  const tx = await bankContract.methods.deposit().send({ from: account, value: amount });
  console.log("Deposit successful:", tx);
}

// Function to transfer funds
async function transfer(senderAccount, receiverAccount, amount) {
  console.log(`Transferring ${amount} wei from ${senderAccount} to ${receiverAccount}`);
  const tx = await bankContract.methods.transfer(receiverAccount, amount).send({ from: senderAccount });
  console.log("Transfer successful:", tx);
}

// Function to withdraw funds
async function withdraw(account, amount) {
  console.log(`Withdrawing ${amount} wei from account: ${account}`);
  const tx = await bankContract.methods.withdraw(amount).send({ from: account });
  console.log("Withdrawal successful:", tx);
}

// Function to check customer data
async function checkData(account) {
  console.log(`Checking data for account: ${account}`);
  const data = await bankContract.methods.check_data().call({ from: account });
  console.log("Customer Data:", data);
}

// Function to check transaction history
async function checkHistory(account) {
  console.log(`Checking transaction history for account: ${account}`);
  const history = await bankContract.methods.check_history().call({ from: account });
  console.log("Transaction History:", history);
}

// Main function to interact with the contract
(async () => {
  try {
    const accounts = await getAccounts();

    // Example usage
    const ownerAccount = accounts[0];
    const customer1 = accounts[1];
    const customer2 = accounts[2];

    // Register customers
    await registerCustomer(customer1, "Alice");
    await registerCustomer(customer2, "Bob");

    // // Deposit funds
    // await deposit(customer1, web3.utils.toWei("1", "ether")); // Deposit 1 ETH
    // await deposit(customer2, web3.utils.toWei("2", "ether")); // Deposit 2 ETH

    // // Transfer funds
    // await transfer(customer1, customer2, web3.utils.toWei("0.5", "ether")); // Transfer 0.5 ETH

    // // Check customer data
    // await checkData(customer1);
    // await checkData(customer2);

    // // Check transaction history
    // await checkHistory(customer1);
    // await checkHistory(customer2);

    // // Withdraw funds
    // await withdraw(customer1, web3.utils.toWei("0.3", "ether")); // Withdraw 0.3 ETH
    // await withdraw(customer2, web3.utils.toWei("1", "ether")); // Withdraw 1 ETH
  } catch (error) {
    console.error("Error interacting with the contract:", error);
  }
})();
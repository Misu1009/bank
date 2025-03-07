// Import dependencies
const {Web3} = require("web3");
const BankContractJSON = require("./build/contracts/Bank.json");

// Connect to the local blockchain (Ganache)
const web3 = new Web3("http://127.0.0.1:xxxx"); // URL Ganache

// Function to get deployed contract address
function getContractAddress() {
  // If you know the contract address, you can return it directly
  // Otherwise, you might need to get it from deployment records
  return "ADDRESS OF DEPLOYED SMART CONTRACT"; // Replace with your contract address
}

// Utility function to get accounts from Ganache
async function getAccounts() {
  try {
    return await web3.eth.getAccounts();
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw error;
  }
}

// Function to register a new customer
async function registerCustomer(bankContract, account, name) {
  try {
    console.log(`Registering customer: ${name} with account: ${account}`);
    const tx = await bankContract.methods.register_customer(name).send({ 
      from: account,
      gas: 200000 // Specify gas limit
    });
    console.log("Customer registered successfully");
    console.log("Transaction hash:", tx.transactionHash);
    return tx;
  } catch (error) {
    console.error(`Error registering customer ${name}:`, error.message);
    throw error;
  }
}

// Function to deposit funds
async function deposit(bankContract, account, amount) {
  try {
    console.log(`Depositing ${web3.utils.fromWei(amount, 'ether')} ETH from account: ${account}`);
    const tx = await bankContract.methods.deposit().send({ 
      from: account, 
      value: amount,
      gas: 200000
    });
    console.log("Deposit successful");
    console.log("Transaction hash:", tx.transactionHash);
    return tx;
  } catch (error) {
    console.error(`Error depositing funds:`, error.message);
    throw error;
  }
}

// Function to transfer funds
async function transfer(bankContract, senderAccount, receiverAccount, amount) {
  try {
    console.log(`Transferring ${web3.utils.fromWei(amount, 'ether')} ETH from ${senderAccount} to ${receiverAccount}`);
    const tx = await bankContract.methods.transfer(receiverAccount, amount).send({ 
      from: senderAccount,
      gas: 200000
    });
    console.log("Transfer successful");
    console.log("Transaction hash:", tx.transactionHash);
    return tx;
  } catch (error) {
    console.error(`Error transferring funds:`, error.message);
    throw error;
  }
}

// Function to withdraw funds
async function withdraw(bankContract, account, amount) {
  try {
    console.log(`Withdrawing ${web3.utils.fromWei(amount, 'ether')} ETH from account: ${account}`);
    const tx = await bankContract.methods.withdraw(amount).send({ 
      from: account,
      gas: 200000
    });
    console.log("Withdrawal successful");
    console.log("Transaction hash:", tx.transactionHash);
    return tx;
  } catch (error) {
    console.error(`Error withdrawing funds:`, error.message);
    throw error;
  }
}

// Function to check customer data
async function checkData(bankContract, account) {
  try {
    console.log(`Checking data for account: ${account}`);
    const data = await bankContract.methods.check_data().call({ from: account });
    console.log("Customer Name:", data[0]);
    console.log("Balance (wei):", data[1]);
    console.log("Balance (ETH):", web3.utils.fromWei(data[1], 'ether'));
    return data;
  } catch (error) {
    console.error(`Error checking customer data:`, error.message);
    throw error;
  }
}

// Function to check transaction history
async function checkHistory(bankContract, account) {
  try {
    console.log(`Checking transaction history for account: ${account}`);
    const history = await bankContract.methods.check_history().call({ from: account });
    console.log("Transaction History:");
    history.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
    return history;
  } catch (error) {
    console.error(`Error checking transaction history:`, error.message);
    throw error;
  }
}

// Main function to interact with the contract
async function main() {
  try {
    // Get contract address and create contract instance
    const contractAddress = await getContractAddress();
    const bankContract = new web3.eth.Contract(BankContractJSON.abi, contractAddress);
    
    const accounts = await getAccounts();

    // Example usage
    const ownerAccount = accounts[0];
    const customer1 = accounts[1];
    const customer2 = accounts[2];

    console.log("Available accounts:", accounts);
    console.log("Owner account:" + ownerAccount );
    console.log("Customer 1:"+ customer1);
    console.log("Customer 2:"+ customer2);
    console.log("\n");

    // Register customers
    // await registerCustomer(bankContract, customer1, "Naruto");
    // await registerCustomer(bankContract, customer2, "Hinata");
    // console.log("\n");

    // Deposit funds
    // const depositAmount1 = web3.utils.toWei("900", "ether");
    // const depositAmount2 = web3.utils.toWei("199", "ether");
    // await deposit(bankContract, customer1, depositAmount1);
    // await deposit(bankContract, customer2, depositAmount2);
    // console.log("\n");

    // Check customer data after deposit
    // await checkData(bankContract, customer1);
    // await checkData(bankContract, customer2);
    // console.log("\n");

    // Transfer funds
    // const transferAmount = web3.utils.toWei("199", "ether");
    // await transfer(bankContract, customer2, customer1, transferAmount);
    // console.log("\n");

    // Check customer data after transfer
    // await checkData(bankContract, customer1);
    // await checkData(bankContract, customer2);
    // console.log("\n");

    // Check transaction history
    // await checkHistory(bankContract, customer1);
    // await checkHistory(bankContract, customer2);
    // console.log("\n");

    // Withdraw funds
    // const withdrawAmount1 = web3.utils.toWei("1899", "ether"); 
    // const withdrawAmount2 = web3.utils.toWei("0.9", "ether"); 
    // await withdraw(bankContract, customer1, withdrawAmount1);
    // await withdraw(bankContract, customer2, withdrawAmount2);
    // console.log("\n");

    // Check customer data after withdraw
    // await checkData(bankContract, customer1);
    // await checkData(bankContract, customer2);
    // console.log("\n");

  } catch (error) {
    console.error("Error in main function:", error.message);
  }
}

// Run the main function
main();

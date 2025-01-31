const { ethers } = require("ethers");
const fs = require("fs");

// Configuration for SaharaAI testnet
const RPC_URL = "https://testnet.saharalabs.ai";
const CHAIN_ID = 313313;

// Load private keys from the file
const privateKeysFile = "privateKeys.json";
let privateKeys = JSON.parse(fs.readFileSync(privateKeysFile, "utf-8"));

// Connect to the SaharaAI testnet
const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID);

async function sendTransactionFromWallet(privateKey) {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);

    // Generate a random Ethereum address
    const randomAddress = ethers.Wallet.createRandom().address;

    // Define the transaction
    const tx = {
      to: randomAddress,
      value: ethers.parseEther("0.00001"), // 0.00001 SAHARA
    };

    // Send the transaction
    const transactionResponse = await wallet.sendTransaction(tx);
    console.log(`Transaction sent from wallet: ${wallet.address}`);
    console.log(`Random Address: ${randomAddress}`);
    console.log(`Transaction Hash: ${transactionResponse.hash}`);

    // Wait for the transaction to be mined
    const receipt = await transactionResponse.wait();
    console.log("Transaction mined!");
    console.log(receipt);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

async function main() {
  for (const privateKey of privateKeys) {
    await sendTransactionFromWallet(privateKey);

    // Remove the used private key from the list
    privateKeys = privateKeys.filter((key) => key !== privateKey);

    // Save the updated private keys back to the file
    fs.writeFileSync(privateKeysFile, JSON.stringify(privateKeys, null, 2), "utf-8");

    // Ensure one wallet sends only one transaction
    break;
  }

  if (privateKeys.length === 0) {
    console.log("All wallets have sent their transactions.");
  }
}

main();

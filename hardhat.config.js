require("@nomicfoundation/hardhat-toolbox");



module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/naB7EVkL9rslZ7MxppLANOFVPQw3sDu2", // Infura endpoint
      accounts: [
        "bf6241a0679e93330484de07412bb05832fdcd56d20017305332639425ebb652" // Replace with your private key
      ],
      chainId: 11155111 // Add this line
    }
  }
};

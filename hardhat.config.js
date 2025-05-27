require("@nomicfoundation/hardhat-toolbox");



module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/naB7EVkL9rslZ7MxppLANOFVPQw3sDu2", // Infura endpoint
      accounts: [
        "3f87af3e5e23e592417e3b48d3572157c48db35e1ef853e9c93de54042061947" // Replace with your private key
      ],
      chainId: 11155111 // Add this line
    }
  }
};

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("Deployer balance:", hre.ethers.utils.formatEther(balance), "ETH");

  const Create = await hre.ethers.getContractFactory("Create");
  const create = await Create.deploy();

  await create.deployed();

  console.log("Contract deployed to:", create.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

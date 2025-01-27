import hre from "hardhat";
async function main() {
  // Get contract factory
  const Token = await hre.ethers.getContractFactory("Token");

  // Deploy without arguments since constructor is empty
  const token = await Token.deploy();

  await token.waitForDeployment();

  const address = await token.getAddress();

  console.log(`MyContract deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
});

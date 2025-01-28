const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token", () => {
  let token;

  beforeEach(async () => {
    // Fetch the token contract factory
    const Token = await ethers.getContractFactory("Token");
    // Deploy the token
    token = await Token.deploy();
    // Wait for deployment
    await token.waitForDeployment();
  });

  it("Check if name is correct", async () => {
    expect(await token.name()).to.equal("My Token");
  });

  it("Check if symbol is correct", async () => {
    expect(await token.symbol()).to.equal("TACH");
  });
});

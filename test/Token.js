const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};
describe("Token", () => {
  let token;

  beforeEach(async () => {
    // Fetch the token contract factory
    const Token = await ethers.getContractFactory("Token");
    // Deploy the token
    token = await Token.deploy(
      "Harish is amazing",
      "HARISH",
      18,
      tokens(1000000)
    );
    // Wait for deployment
    await token.waitForDeployment();
  });
  describe("Deployment", () => {
    const name = "Harish is amazing";
    const symbol = "HARISH";
    const decimals = 18;
    it("Check if name is correct", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("Check if symbol is correct", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });
    it("Check if decimals is correct", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });
    it("Check if total supply is correct", async () => {
      const value = tokens(1000000);
      expect(await token.totalSupply()).to.equal(value);
    });
  });
});

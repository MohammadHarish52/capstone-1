const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let exchange, token1, user1, owner, feeAccount;

  const feePercent = 10;

  beforeEach(async () => {
    [owner, feeAccount, user1] = await ethers.getSigners();
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");
    token1 = await Token.deploy(
      "Harish is amazing",
      "HARISH",
      18,
      tokens(1000000),
    );
    exchange = await Exchange.deploy(feeAccount.address, feePercent);
  });

  describe("Deployment", () => {
    it("tracks the fee account", async () => {
      expect(await exchange.feeAccount()).to.equal(feeAccount.address);
    });
    it("Checks the fee Percent", async () => {
      expect(await exchange.feePercent()).to.equal(feePercent);
    });
  });
  describe("Depositing Tokens", () => {
    let transaction, result;
    let amount = tokens(100);
    beforeEach(async () => {
      transaction = await exchange
        .connect(user1)
        .depositToken(token1.address, amount, { from: user1 });
    });

    describe("Success", async () => {});
    describe("Failure", async () => {});
  });
});

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
    let transaction = await token1
      .connect(user1)
      .transfer(user1.address, tokens(1000));
    let result = await transaction.wait();
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
      // apporve the token
      transaction = await token1
        .connect(user1)
        .approve(exchange.address, amount, { from: user1 });
      result = await transaction.wait();

      // deposit the token
      transaction = await exchange
        .connect(user1)
        .depositToken(token1.address, amount, { from: user1 });
      result = await transaction.wait();
    });

    describe("Success", async () => {
      it("tracks the token deposit", async () => {
        expect(await token1.balanceOf(exchange.address).to.equal(amount));
        expect(
          await exchange.tokens(token1.address, user1.address).to.equal(amount),
        );
        expect(
          await exchange
            .balanceOf(token1.address, user1.address)
            .to.equal(amount),
        );
      });
    });
    describe("Failure", async () => {});
  });
});

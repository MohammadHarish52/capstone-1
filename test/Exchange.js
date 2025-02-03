const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let exchange, owner, feeAccount;

  const feePercent = 10;

  beforeEach(async () => {
    [owner, feeAccount] = await ethers.getSigners();
    const Exchange = await ethers.getContractFactory("Exchange");
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
});

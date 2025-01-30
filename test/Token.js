const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, owner, receiver, exchange;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    [owner, receiver, exchange] = await ethers.getSigners();
    token = await Token.deploy(
      "Harish is amazing",
      "HARISH",
      18,
      tokens(1000000),
    );
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
    it("Assigning total supply to deployer", async () => {
      expect(await token.balanceOf(owner.address)).to.equal(tokens(1000000));
    });
  });

  describe("Sending tokens", () => {
    let amount, transaction, result;

    describe("Success", () => {
      beforeEach(async () => {
        amount = tokens(100);
        transaction = await token
          .connect(owner)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("Transfer Token balance", async () => {
        expect(await token.balanceOf(owner.address)).to.equal(tokens(999900));
        expect(await token.balanceOf(receiver.address)).to.equal(tokens(100));
      });

      it("Emits a Transfer event", async () => {
        const event = result.logs[0];
        expect(event.fragment.name).to.equal("Transfer");
        expect(event.args[0]).to.equal(owner.address);
        expect(event.args[1]).to.equal(receiver.address);
        expect(event.args[2]).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("Insufficient balance", async () => {
        amount = tokens(100000000001);
        await expect(
          token.connect(owner).transfer(receiver.address, amount),
        ).to.be.revertedWith("Insufficient balance");
      });

      it("Recipient cannot be zero address", async () => {
        amount = tokens(100);
        await expect(
          token.connect(owner).transfer(ethers.ZeroAddress, amount),
        ).to.be.revertedWith("Invalid address");
      });
    });
  });
  describe("Approving tokens", () => {
    describe("Success", () => {
      let amount, transaction, result;
      beforeEach(async () => {
        amount = tokens(100);
        transaction = await token
          .connect(owner)
          .approve(exchange.address, amount);
        result = await transaction.wait();
      });
      it("Allocates an allowance for delegated token spending tokens", async () => {
        expect(await token.allowance(owner.address, exchange.address)).to.equal(
          amount,
        );
      });
      it("Emits an Approval event", async () => {
        const event = result.logs[0];
        expect(event.fragment.name).to.equal("Approval");
        expect(event.args[0]).to.equal(owner.address);
        expect(event.args[1]).to.equal(exchange.address);
        expect(event.args[2]).to.equal(amount);
      });
    });
    describe("Failure", () => {
      it("Rejects invalid spender address", async () => {
        await expect(
          token.connect(owner).approve(ethers.ZeroAddress, tokens(100)),
        ).to.be.revertedWith("Invalid address");
      });
    });
  });
});

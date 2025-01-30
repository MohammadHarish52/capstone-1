const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  // Helper function to convert number to token units
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Token", () => {
  let token, owner, receiver, exchange;
  const NAME = "Harish is amazing";
  const SYMBOL = "HARISH";
  const DECIMALS = 18;
  const TOTAL_SUPPLY = tokens(1000000);

  // Helper function to check transfer events
  const checkTransferEvent = async (result, from, to, value) => {
    const event = result.logs[0];
    expect(event.fragment.name).to.equal("Transfer");
    expect(event.args[0]).to.equal(from);
    expect(event.args[1]).to.equal(to);
    expect(event.args[2]).to.equal(value);
  };

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    [owner, receiver, exchange] = await ethers.getSigners();
    token = await Token.deploy(NAME, SYMBOL, DECIMALS, TOTAL_SUPPLY);
  });

  describe("Deployment", () => {
    it("Check token details", async () => {
      expect(await token.name()).to.equal(NAME);
      expect(await token.symbol()).to.equal(SYMBOL);
      expect(await token.decimals()).to.equal(DECIMALS);
      expect(await token.totalSupply()).to.equal(TOTAL_SUPPLY);
      expect(await token.balanceOf(owner.address)).to.equal(TOTAL_SUPPLY);
    });
  });

  describe("Token transfers and approvals", () => {
    const amount = tokens(100);

    describe("Standard transfer", () => {
      let result;

      beforeEach(async () => {
        const transaction = await token
          .connect(owner)
          .transfer(receiver.address, amount);
        result = await transaction.wait();
      });

      it("Transfers token balances", async () => {
        expect(await token.balanceOf(owner.address)).to.equal(
          TOTAL_SUPPLY - amount,
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
        await checkTransferEvent(
          result,
          owner.address,
          receiver.address,
          amount,
        );
      });
    });

    describe("Approving tokens", () => {
      let result;

      beforeEach(async () => {
        const transaction = await token
          .connect(owner)
          .approve(exchange.address, amount);
        result = await transaction.wait();
      });

      it("Approves tokens for delegated transfer", async () => {
        expect(await token.allowance(owner.address, exchange.address)).to.equal(
          amount,
        );
        const event = result.logs[0];
        expect(event.fragment.name).to.equal("Approval");
        expect(event.args[0]).to.equal(owner.address);
        expect(event.args[1]).to.equal(exchange.address);
        expect(event.args[2]).to.equal(amount);
      });
    });

    describe("Delegated transfer", () => {
      let result;

      beforeEach(async () => {
        await token.connect(owner).approve(exchange.address, amount);
        const transaction = await token
          .connect(exchange)
          .transferFrom(owner.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it("Transfers tokens through delegation", async () => {
        expect(await token.balanceOf(owner.address)).to.equal(
          TOTAL_SUPPLY - amount,
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
        expect(await token.allowance(owner.address, exchange.address)).to.equal(
          0,
        );
        await checkTransferEvent(
          result,
          owner.address,
          receiver.address,
          amount,
        );
      });
    });

    describe("Transfer failures", () => {
      const amount = tokens(100);

      describe("Invalid addresses", () => {
        it("Rejects transfer to zero address", async () => {
          await expect(
            token.connect(owner).transfer(ethers.ZeroAddress, amount),
          ).to.be.revertedWith("Invalid address");
        });

        it("Rejects approve to zero address", async () => {
          await expect(
            token.connect(owner).approve(ethers.ZeroAddress, amount),
          ).to.be.revertedWith("Invalid address");
        });

        it("Rejects transferFrom to zero address", async () => {
          // First approve exchange
          await token.connect(owner).approve(exchange.address, amount);

          await expect(
            token
              .connect(exchange)
              .transferFrom(owner.address, ethers.ZeroAddress, amount),
          ).to.be.revertedWith("Invalid address");
        });
      });

      describe("Insufficient balances", () => {
        const invalidAmount = tokens(100000000001);

        it("Rejects transfer with insufficient balance", async () => {
          await expect(
            token.connect(owner).transfer(receiver.address, invalidAmount),
          ).to.be.revertedWith("Insufficient balance");
        });

        it("Rejects transferFrom with insufficient balance", async () => {
          await token.connect(owner).approve(exchange.address, invalidAmount);

          await expect(
            token
              .connect(exchange)
              .transferFrom(owner.address, receiver.address, invalidAmount),
          ).to.be.revertedWith("Insufficient balance");
        });
      });
    });
  });
});

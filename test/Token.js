const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};
describe("Token", () => {
  let token, owner, reciever;

  beforeEach(async () => {
    // Fetch the token contract factory
    const Token = await ethers.getContractFactory("Token");
    // Deploy the token
    token = await Token.deploy(
      "Harish is amazing",
      "HARISH",
      18,
      tokens(1000000),
    );
    // Wait for deployment
    await token.waitForDeployment();
    // get the owner
    [owner, reciever] = await ethers.getSigners();
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
    let amount, transaction, receipt;
    it("Transfer Token balance", async () => {
      // transfer from owner to reciever
      amount = tokens(100);
      transaction = await token.connect(owner).transfer(reciever, amount);
      receipt = await transaction.wait();

      expect(await token.balanceOf(owner.address)).to.equal(tokens(999900));
      expect(await token.balanceOf(reciever.address)).to.equal(tokens(100));
    });
    it("Emits a Transfer event", async () => {
      const event = receipt.logs[0];
      expect(event.fragment.name).to.equal("Transfer");
      expect(event.args[0]).to.equal(owner.address);
      expect(event.args[1]).to.equal(reciever.address);
      expect(event.args[2]).to.equal(amount);
    });
  });
});

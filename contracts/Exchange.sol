// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "./Token.sol";
import "hardhat/console.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function depositToken(address _token, uint256 _amount) public {
        // Transfer token
        Token token = Token(_token);
        token.transferFrom(msg.sender, address(this), _amount);
        // update user balance

        // Emit event
    }
}

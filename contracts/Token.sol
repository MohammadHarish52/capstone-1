// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Token {
    string public name = "My Token";
    string public symbol = "TACH";
    uint public decimals = 18;
    uint public totalSupply = 1000000 * (10 ** decimals);

    //Track balances
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    // Defining an event
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint _decimals,
        uint _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = totalSupply;
    }
    function transfer(address _to, uint _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        // zero address check
        require(_to != address(0), "Invalid address");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // emitting an event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function approve(
        address _spender,
        uint _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}

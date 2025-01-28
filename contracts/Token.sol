// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";

contract Token {
   string public name = "My Token";
   string public symbol = "TACH";
   uint public decimals = 18;
   uint public totalSupply = 1000000 * (10 ** decimals);

   constructor(string memory _name , string memory _symbol , uint _decimals , uint _totalSupply) {
       name = _name;
       symbol = _symbol;
       decimals = _decimals;
       totalSupply = _totalSupply ;

   }

}

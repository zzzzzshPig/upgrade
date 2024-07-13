// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import 'hardhat/console.sol';

contract Counter {
  uint256 public count;

  function increment() external {
    count += 1;
    console.log(count);
  }
}

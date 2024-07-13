// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './Counter.sol';

contract MyContract is Counter {
  constructor() {
    console.log('constructor');
  }

  function incrementCounter() external {
    this.increment();
  }
}

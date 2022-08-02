// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BoxV2 {
    uint256 internal value;

    event ValueChanged(uint256 newValue);

    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }

    // Increments the stored value by 1
    function increment() public {
        value = value + 1;
        emit ValueChanged(value);
    }

    function version() public pure returns (uint256) {
        return 2;
    }
}

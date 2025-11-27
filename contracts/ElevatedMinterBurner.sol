// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IMintableBurnable } from "@layerzerolabs/oft-evm/contracts/interfaces/IMintableBurnable.sol";
import { IMintableBurnableV2 } from "./IMintableBurnableV2.sol";

contract ElevatedMinterBurner is IMintableBurnable, Ownable {
    IMintableBurnableV2 public immutable token;
    mapping(address => bool) public operators;
    bool private operatorSetCalled;

    modifier onlyOperators() {
        require(operators[msg.sender], "Not authorized");
        _;
    }

    constructor(IMintableBurnableV2 _token, address _owner) Ownable(_owner) {
        token = _token;
    }

    function setOperator(address _operator) external onlyOwner {
        require(!operatorSetCalled, "setOperator can only be called once");
        operators[_operator] = true;
        operatorSetCalled = true;
    }

    function removeOperator(address _operator) external onlyOwner {
        operators[_operator] = false;
    }

    function burn(address _from, uint256 _amount) external override onlyOperators returns (bool) {
        token.burn(_from, _amount);
        return true;
    }

    function mint(address _to, uint256 _amount) external override onlyOperators returns (bool) {
        token.mint(_to, _amount);
        return true;
    }
}
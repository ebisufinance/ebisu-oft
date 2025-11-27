// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

/// @title Interface for mintable and burnable tokens that don't return bool
interface IMintableBurnableV2 {
    /**
     * @notice Burns tokens from a specified account
     * @param _from Address from which tokens will be burned
     * @param _amount Amount of tokens to be burned
     */
    function burn(address _from, uint256 _amount) external;

    /**
     * @notice Mints tokens to a specified account
     * @param _to Address to which tokens will be minted
     * @param _amount Amount of tokens to be minted
     */
    function mint(address _to, uint256 _amount) external;
}


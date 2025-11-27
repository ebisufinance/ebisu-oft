// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@nomicfoundation/hardhat-verify'
import '@layerzerolabs/toolbox-hardhat'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

import './type-extensions'
import './tasks/sendOFT'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        'arbitrum-sepolia': {
            eid: EndpointId.ARBSEP_V2_TESTNET,
            url: process.env.RPC_URL_ARB_SEPOLIA || 'https://arbitrum-sepolia.gateway.tenderly.co',
            accounts,
        },
        'mainnet': {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: process.env.RPC_URL_ETH_MAINNET,
            accounts,
            oftAdapter: {
                tokenAddress: '0x09fd37d9aa613789c517e76df1c53aece2b60df4', // Set the token address for the OFT adapter
            },
            elevatedMinterBurner: {
                tokenAddress: '0x09fd37d9aa613789c517e76df1c53aece2b60df4', // Set the token address for the ElevatedMinterBurner
            },
            mintBurnOftAdapter: {
                tokenAddress: '0x09fd37d9aa613789c517e76df1c53aece2b60df4', // Set the token address for the MintBurnOFTAdapter
                minterBurnerAddress: '0xFb2B88B3f888149ee6167b52b8440A56fe991cC4', // Optional: ElevatedMinterBurner address (will use deployment if not provided)
            },
        },
        'plasma-mainnet': {
            eid: EndpointId.PLASMA_V2_MAINNET,
            url: 'https://plasma.drpc.org',
            accounts,
            oftAdapter: {
                tokenAddress: '0xef7b1a03e0897c33b63159e38d779e3970c0e2fc', // Set the token address for the OFT adapter
            },
            elevatedMinterBurner: {
                tokenAddress: '0xef7b1a03e0897c33b63159e38d779e3970c0e2fc', // Set the token address for the ElevatedMinterBurner
            },
            mintBurnOftAdapter: {
                tokenAddress: '0xef7b1a03e0897c33b63159e38d779e3970c0e2fc', // Set the token address for the MintBurnOFTAdapter
                minterBurnerAddress: '0xC23Fc24C55DB916AE0D6E3f533E89f67462D64b2', // Optional: ElevatedMinterBurner address (will use deployment if not provided)
            },
        },
        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    etherscan: {
        apiKey: {
            'plasma-mainnet': 'ANY_STRING_WORKS', // API key is not required by Routescan
        },
        customChains: [
            {
                network: 'plasma-mainnet',
                chainId: 9745,
                urls: {
                    apiURL: 'https://api.routescan.io/v2/network/mainnet/evm/9745/etherscan',
                    browserURL: 'https://routescan.io',
                },
            },
        ],
    },
}

export default config

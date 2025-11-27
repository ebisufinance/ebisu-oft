import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'MyMintBurnOFTAdapter'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy, get } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // This is an external deployment pulled in from @layerzerolabs/lz-evm-sdk-v2
    //
    // @layerzerolabs/toolbox-hardhat takes care of plugging in the external deployments
    // from @layerzerolabs packages based on the configuration in your hardhat config
    //
    // For this to work correctly, your network config must define an eid property
    // set to `EndpointId` as defined in @layerzerolabs/lz-definitions
    //
    // For example:
    //
    // networks: {
    //   fuji: {
    //     ...
    //     eid: EndpointId.AVALANCHE_V2_TESTNET
    //   }
    // }
    const endpointV2Deployment = await get('EndpointV2')

    // The token address and minterBurner address must be defined in hardhat.config.ts
    // If the addresses are not defined, the deployment will fail
    if (hre.network.config.mintBurnOftAdapter == null) {
        throw new Error(`mintBurnOftAdapter not configured on network config. This is required for MyMintBurnOFTAdapter deployment.`)
    }

    // ElevatedMinterBurner address must be explicitly set in config - this is mandatory
    if (hre.network.config.mintBurnOftAdapter.minterBurnerAddress == null) {
        throw new Error(`minterBurnerAddress is required in mintBurnOftAdapter config. This is mandatory for MyMintBurnOFTAdapter deployment.`)
    }

    const minterBurnerAddress = hre.network.config.mintBurnOftAdapter.minterBurnerAddress

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            hre.network.config.mintBurnOftAdapter.tokenAddress, // token address
            minterBurnerAddress, // ElevatedMinterBurner address
            endpointV2Deployment.address, // LayerZero's EndpointV2 address
            deployer, // owner
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy


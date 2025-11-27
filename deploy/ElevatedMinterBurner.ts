import assert from 'assert'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'ElevatedMinterBurner'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    assert(deployer, 'Missing named deployer account')

    console.log(`Network: ${hre.network.name}`)
    console.log(`Deployer: ${deployer}`)

    // The token address must be defined in hardhat.config.ts
    // If the token address is not defined, the deployment will log a warning and skip the deployment
    if (hre.network.config.elevatedMinterBurner == null) {
        console.warn(`elevatedMinterBurner not configured on network config, skipping ElevatedMinterBurner deployment`)

        return
    }

    try {
        const { address } = await deploy(contractName, {
            from: deployer,
            args: [
                hre.network.config.elevatedMinterBurner.tokenAddress, // token address (must implement IMintableBurnable)
                deployer, // owner
            ],
            log: true,
            skipIfAlreadyDeployed: false,
        })

        console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
    } catch (error: any) {
        // Handle parsing errors that occur after successful deployment
        // Check if the error is about invalid address parsing (deployment may have succeeded)
        if (error?.code === 'INVALID_ARGUMENT' && error?.argument === 'address' && error?.checkKey === 'to') {
            console.warn('Deployment transaction sent but encountered parsing error. Checking if deployment succeeded...')
            // Try to get the deployment address from the transaction hash if available
            const txHash = error?.transactionHash
            if (txHash) {
                try {
                    const receipt = await hre.ethers.provider.getTransactionReceipt(txHash)
                    if (receipt && receipt.contractAddress) {
                        console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${receipt.contractAddress}`)
                        console.log(`Transaction hash: ${txHash}`)
                        return
                    }
                } catch (checkError) {
                    // Fall through to rethrow original error
                }
            }
        }
        throw error
    }
}

deploy.tags = [contractName]

export default deploy


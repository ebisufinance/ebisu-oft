import 'hardhat/types/config'

interface OftAdapterConfig {
    tokenAddress: string
}

interface ElevatedMinterBurnerConfig {
    tokenAddress: string
}

interface MintBurnOftAdapterConfig {
    tokenAddress: string
    minterBurnerAddress?: string // Optional: if not provided, will try to get from ElevatedMinterBurner deployment
}

declare module 'hardhat/types/config' {
    interface HardhatNetworkUserConfig {
        oftAdapter?: never
        elevatedMinterBurner?: never
        mintBurnOftAdapter?: never
    }

    interface HardhatNetworkConfig {
        oftAdapter?: never
        elevatedMinterBurner?: never
        mintBurnOftAdapter?: never
    }

    interface HttpNetworkUserConfig {
        oftAdapter?: OftAdapterConfig
        elevatedMinterBurner?: ElevatedMinterBurnerConfig
        mintBurnOftAdapter?: MintBurnOftAdapterConfig
    }

    interface HttpNetworkConfig {
        oftAdapter?: OftAdapterConfig
        elevatedMinterBurner?: ElevatedMinterBurnerConfig
        mintBurnOftAdapter?: MintBurnOftAdapterConfig
    }
}

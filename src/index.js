import { Flyover } from '@rsksmart/flyover-sdk';
import { ethers } from 'ethers';
import { RSK_TESTNODES } from './utils/constants.js';
import dotenv from "dotenv";
dotenv.config();
class CustomBlockchainConnection {
    provider;
    signer;
    constructor(privateKey, rpcUrl) {
        this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
        this.signer = new ethers.Wallet(privateKey, this.provider);
    }
    // Implements getAbstraction
    getAbstraction() {
        return this.signer;
    }
    // Implements getChainId
    async getChainId() {
        return (await this.provider.getNetwork()).chainId;
    }
    // Implements getChainHeight
    async getChainHeight() {
        return await this.provider.getBlockNumber();
    }
    // Implements getTransactionReceipt
    async getTransactionReceipt(tx) {
        const receipt = await this.provider.getTransactionReceipt(tx);
        if (!receipt)
            return null;
        // Map receipt to ContractReceipt if needed
        return {
            ...receipt,
            gasUsed: ethers.BigNumber.from(receipt.gasUsed),
            cumulativeGasUsed: ethers.BigNumber.from(receipt.cumulativeGasUsed),
            effectiveGasPrice: ethers.BigNumber.from(receipt.effectiveGasPrice || 0),
            confirmations: await this.provider.getBlockNumber() - (receipt.blockNumber || 0),
        };
    }
    // Implements getConnectedAddress
    async getConnectedAddress() {
        return await this.signer.getAddress();
    }
}
async function main() {
    const rpcUrl = RSK_TESTNODES[0];
    const privateKey = process.env.PRIVATE_KEY;
    console.log(`privateKey: ${privateKey} | ${privateKey}`);
    // Create a custom blockchain connection
    const blockchainConnection = new CustomBlockchainConnection(privateKey, rpcUrl);
    // Initialize Flyover SDK
    const flyover = new Flyover({
        network: 'Testnet',
        captchaTokenResolver: async () => Promise.resolve(''),
    });
    // Connect Flyover to the custom blockchain connection
    await flyover.connectToRsk(blockchainConnection);
    console.log('Flyover connected to Rootstock Testnet successfully');
    // Fetch and use liquidity providers
    try {
        const providers = await flyover.getLiquidityProviders();
        console.log('Liquidity Providers:', providers);
        if (providers.length > 0) {
            flyover.useLiquidityProvider(providers[0]);
            console.log('Using liquidity provider:', providers[0]);
        }
        else {
            console.log('No liquidity providers found.');
        }
    }
    catch (error) {
        console.error('Error fetching liquidity providers:', error);
    }
}
main().catch((error) => {
    console.error('Error in Flyover setup:', error);
});

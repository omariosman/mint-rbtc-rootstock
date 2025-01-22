import { Flyover } from '@rsksmart/flyover-sdk';
import { BlockchainConnection } from '@rsksmart/bridges-core-sdk';
import { ethers } from 'ethers';
import { RSK_TESTNET_NODES } from './utils/constants.js';
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
    const rpcUrl = RSK_TESTNET_NODES[0];
    const privateKey = process.env.PRIVATE_KEY;
    const walletAddress = '0xd175c97eD5Fc71eca4dD70Df7Ac799Ef808A6942';
    // Create a custom blockchain connection
    // // const blockchainConnection = new CustomBlockchainConnection(privateKey, rpcUrl);
    const rsk = await BlockchainConnection.createUsingPassphrase(process.env.MNEMONIC_PHRASE, rpcUrl);
    // Initialize Flyover SDK
    const flyover = new Flyover({
        network: 'Testnet',
        rskConnection: rsk,
        captchaTokenResolver: async () => Promise.resolve(''),
    });
    // Connect Flyover to the custom blockchain connection
    // //await flyover.connectToRsk((blockchainConnection as unknown) as BlockchainConnection);
    console.log('Flyover connected to Rootstock Testnet successfully');
    // Fetch and use liquidity providers
    try {
        const providers = await flyover.getLiquidityProviders();
        // console.log('Liquidity Providers:', providers);
        if (!providers || providers.length === 0) {
            console.error('No liquidity providers available.');
            return;
        }
        // Use the first available liquidity provider
        const selectedProvider = providers[0];
        flyover.useLiquidityProvider(selectedProvider);
        // console.log('Using liquidity provider:', selectedProvider);
        // Define the PeginQuoteRequest
        const quoteRequest = {
            callContractArguments: '',
            callEoaOrContractAddress: walletAddress,
            rskRefundAddress: walletAddress,
            valueToTransfer: BigInt("5000000000000000"),
        };
        // Request quotes
        const quotes = await flyover.getQuotes(quoteRequest);
        if (quotes.length === 0) {
            console.error('No quotes available.');
            return;
        }
        // Accept the first quote
        const acceptedQuote = await flyover.acceptQuote(quotes[0]);
        console.log('Accepted Quote:', acceptedQuote);
    }
    catch (error) {
        console.error('Error fetching liquidity providers:', error);
    }
}
main().catch((error) => {
    console.error('Error in Flyover setup:', error);
});

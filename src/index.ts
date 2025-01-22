import { Flyover } from '@rsksmart/flyover-sdk';
import { BlockchainConnection } from '@rsksmart/bridges-core-sdk';
import { RSK_TESTNET_NODES } from './utils/constants.js';
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const rpcUrl = RSK_TESTNET_NODES[0];
    const walletAddress = '0xd175c97eD5Fc71eca4dD70Df7Ac799Ef808A6942';

    // Create a custom blockchain connection
    const rsk = await BlockchainConnection.createUsingPassphrase(process.env.MNEMONIC_PHRASE as string, rpcUrl);
    console.log(`process.env.RECAPTCHA_TOKEN: ${process.env.RECAPTCHA_TOKEN}`);
    // Initialize Flyover SDK
    const flyover = new Flyover({
        network: 'Testnet',
        rskConnection: rsk,
        captchaTokenResolver: async () => Promise.resolve(process.env.RECAPTCHA_TOKEN as string),
    });

    console.log('Flyover connected to Rootstock Testnet successfully');

    // Fetch and use liquidity providers
    try {
        const providers = await flyover.getLiquidityProviders();
        console.log('Liquidity Providers:', providers);

        if (!providers || providers.length === 0) {
            console.error('No liquidity providers available.');
            return;
        }

        // Use the first available liquidity provider
        const selectedProvider = providers[0];
        flyover.useLiquidityProvider(selectedProvider);
        console.log('Using liquidity provider:', selectedProvider);

        // Define the PeginQuoteRequest
        const quoteRequest = {
            callContractArguments: '', 
            callEoaOrContractAddress: walletAddress,
            rskRefundAddress: walletAddress,
            valueToTransfer: BigInt("5000000000000000"),
        }
        
        // Request quotes
        const quotes = await flyover.getQuotes(quoteRequest);
        
        if (quotes.length === 0) {
            console.error('No quotes available.');
            return;
        }

        // Accept the first quote
        const acceptedQuote = await flyover.acceptQuote(quotes[0]);
        console.log('Accepted Quote:', acceptedQuote);
    } catch (error) {
        console.error('Error fetching liquidity providers:', error);
    }
}

main().catch((error) => {
    console.error('Error in Flyover setup:', error);
});

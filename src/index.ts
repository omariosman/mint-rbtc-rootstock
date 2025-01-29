import { Flyover } from '@rsksmart/flyover-sdk';
import { BlockchainConnection, Network } from '@rsksmart/bridges-core-sdk';
import { RPC_NODE } from './utils/constants.js';
import { NETWORKS } from './utils/constants.js';
import { load } from 'recaptcha-v3';

import dotenv from "dotenv";

dotenv.config();

async function main() {
    const rpcUrl = RPC_NODE.TESTNET;
    const walletAddress = process.env.WALLET_ADDRESS as string;

    // Create a custom blockchain connection
    const rsk = await BlockchainConnection.createUsingPassphrase(process.env.MNEMONIC_PHRASE as string, rpcUrl);
    
    // Initialize Flyover SDK
    const flyover = new Flyover({
        network: NETWORKS.Testnet as Network,
        rskConnection: rsk,
        captchaTokenResolver: async() => Promise.resolve('03AFcWeA6ZgRbTJIFR2HxtonjdsltnjQDtYMcMx5QgsNErwPcpMhMvJQ2vm_6qU9UNqCta2aE8APxEr9qKMgsH_BVQIcPBp04KV7xB6NEt-B4sg7_-Y7VldoEt-OZ673KnS-YUlUlox8eaFSbjGG3ekOofGYRBzT-VImYUvREn5WFuK1VVuRQwa7DwAgbSM6xIFvbA3_YfVkJ-qiRg7aodWaXMK0APJ1_SnMIfsxH2Ib57VfDdEkCcR0ndmfh5o8ETqCh2khXGwpTU9UqzWpTkkP9blrx3e_A-1aGIBlfY6Uzg5juIJEklNSLzMihJRg7yz4HcvWqSxh5jf1wLcqCLBNNjgkmfbZkoX74A17vXAgjPUC7ZBYSsEEpiZvFhhTY0TRiVsmcBDdfP7hops58WRX3EXG5dtLieLfSoR2rIYekhNR7yUIG2AfvtIUkLFeBUAXEde6E99L6All9isE8WHDJ0vesEFd2BBe5erJq2ZZ2hV4s4BjGmsLz4aukEjn9s8zje2RPz5Kk02OaK-FVaxQ4Vdg-T5g0VntrQHKNqAZ-KiSaO1u5_D0ZiT-Cda19VC8iVdUlcaUBI-L4gT5cQHN_rmpNeJJdvcWGK0zWdgfUG5xltyGU2x1SWLSHW3ilsox63-5r6ynW0ZR-zNssuhyaHzWlsJhCbKnwfdCeaY1cgGPYoU72QObGicMnrztYp72hhcXq5vLHJmdmXBTecGYqVPkCTOg70coUjN6C2fir5kG1DCJfpgc7LpHHUaNs-UxwYxysbO0RsC7Jyb3x0SSp8I0zC9t6NpJ_NLU4Xj2dyw3foVWiWNK5bZgCzbwmpHTQHVlASBMHYAkXpKxJJf2z995t03Q4WN7DArbUZEb0PtV1Bchcd0yUr4yYJuujOMdzhVy5mv5h6HCVSygWLy2ZxdqO9qafLSJU3H920boahvJblRujuh-NEdSpb3tjMt8dFteFX4STYGk6raxoE4270CqYeJgEDOd854tMlepWrNwVg59QX3NnOiz_Io05FdoEa9SUlxulHy0adK58_TmH2ZGND1R7ZEZAqprb9yYEX1BtXahq0mL7_mKbqVNu6PevjZfwUCGymf4MezqhP5xsj5rmo3TkYHXEk3RGR9_r8Q5Hxzh3TrkXr1K2dkoFPKIcP2ll9XYoV75-_grPjqTo_Dd8t_vSHqXdEvT5dPxwZ8p1UR3HpB-dd1-RY90cRZVQKSve5s7NSGF1Z8Xwxn2pJ6O3aW1ugbWmmieiOG1VYl2F2ONHHXpRBFr9wHBcCDMfomRKsHx5cXYzEq_2LOGJYMN0WuVbgm7nE1h_cPsvjANfFat0pcdv3afbwOBv45Nq_OXKqTPzuKVCZrhZWoiV2qxrgb9lta-t7uxL-nE5IBpHAQ2Yr5RfYmzs7v2vxGqSl4nnyn677vroeeRZCd8YN2Tz3G3nZlloAjtm2IYeAU7Xxbmwf5QhewsT7BfwhLyiOML8RKmptgQ8qMCzDySVb--q2dtf4KV6tEVe8M-NM3biNsqQG53hxJ4PPGxLmEX7HB0jIBkj0sRiICA6uiZ50UQ5eq6L1jjWYeqJC8qvUw528SoGciUin9EjtfoSbXH8ySRrf206Ye1pJ7Bcw6S-SeYVPxTK2d58sTLZ1Q6rMhbCR_REHIlpP8atsgfv3EoIVvcWKXyXTloKcFyssdAbF6Q6F3JFK9FBRWswL5ZxLIDqEev3r5m_djIGbJx675RXB6NzyWk8ZBO3YkbHcYB66EIYqOprim8RwD1s1u6BMLrsztGMbVURxB05A7153hYQCcecKCETPNCUYlw9e0O1VxSR9kJXNht_sxPdf5pBZW51TO93I_zMUk-fD01BTgpxekvchS0xWTx8ArxqSFk_MswSuLCvutiX691qvNgSnp_s004hGS1nGkE_Y_9efmMs6MjlKC0DXt7_1WDhLdcMRLOyWZSsQfQ')
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

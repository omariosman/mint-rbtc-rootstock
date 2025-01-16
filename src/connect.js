// import { Flyover } from '@rsksmart/flyover-sdk';
// import BlockchainReadOnlyConnection from '@rsksmart/flyover-sdk';
// import { providers } from 'ethers';
export {};
// (async () => {
//   // Initialize the Flyover instance for the testnet
//   const flyover = new Flyover({
//     network: 'Testnet',
//     captchaTokenResolver: async () => Promise.resolve(''), // Provide a valid captcha token if required
//   });
//   // Create a read-only connection to the RSK testnet node
//   const rskConnection = await BlockchainReadOnlyConnection.createUsingRpc('https://public-node.testnet.rsk.co');
//   try {
//     // Connect Flyover to the RSK testnet
//     await flyover.connectToRsk(rskConnection);
//     // Verify the connection
//     const isConnected = await flyover.isConnected();
//     console.log('Connected to RSK Testnet:', isConnected);
//     // Optionally, you can fetch the current block number as a test
//     const currentBlock = await rskConnection.getChainHeight();
//     console.log('Current Block Number:', currentBlock);
//   } catch (error) {
//     console.error('Error connecting to RSK Testnet:', error);
//   }
// })();
// const provider = new providers.JsonRpcProvider('https://public-node.testnet.rsk.co');
// const flyover = new Flyover({
//     network: 'Testnet',
//     captchaTokenResolver: async () => Promise.resolve(''),
// });
// await flyover.connectToRsk({
//     getAbstraction: () => provider,
//     getChainId: () => provider.getNetwork().then((network) => network.chainId),
//     getChainHeight: () => provider.getBlockNumber(),
//     getTransactionReceipt: (tx) => provider.getTransactionReceipt(tx),
// });

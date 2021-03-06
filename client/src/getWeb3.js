import Web3 from "web3";
// import WalletConnectProvider from '@walletconnect/web3-provider';
// const HDWalletProvider = require('@truffle/hdwallet-provider');

const getWeb3 = () =>
    new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else if (window.web3) {
                const web3 = window.web3;
                console.log('Injected web3 detected.');
                resolve(web3);
            } else {
                const provider = new Web3.providers.HttpProvider(
                "http://127.0.0.1:8545"
              );
                const web3 = new Web3(provider);
                console.log('No web3 instance injected, using Local web3.');
                resolve(web3);
            }
        });
    });

export default getWeb3;
// import Web3 from "web3";
// const HDWalletProvider = require('@truffle/hdwallet-provider');

// const getWeb3 = () =>
//     new Promise((resolve, reject) => {
//         window.addEventListener('load', async () => {
//             if (window.ethereum) {
//                 const web3 = new Web3(window.ethereum);
//                 try {

//            

//                     resolve(web3);
//                 } catch (error) {
//                     reject(error);
//                 }
//             } else if (window.web3) {
//                 const web3 = window.web3;
//                 console.log('Injected web3 detected.');
//                 resolve(web3);
//             } else {
//             const provider = new WalletConnectProvider({
//                 infuraId: '6b4c4d04d73d4ce2b953654be307a5dc',
//             });

//             // const provider = new Web3.providers.HttpProvider(
//             //     "http://127.0.0.1:8545"
//             //   );

//             const web3 = new Web3(provider);

//             resolve(web3);
//             }
//         });
//     });

// export default getWeb3;
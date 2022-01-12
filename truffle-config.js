const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');

// const infurakey = '6b4c4d04d73d4ce2b953654be307a5dc';
// const mnemonic = fs.readFileSync('.secret').toString().trim();

module.exports = {
    contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
    networks: {
        // ropsten: {
        //     provider: () =>
        //         new HDWalletProvider(
        //             mnemonic,
        //             `https://ropsten.infura.io/v3/${infurakey}`,
        //         ),
        //     network_id: 3,
        //     gas: 5500000,
        //     gasPrice: 20000000000,
        //     confirmations: 2,
        //     timeoutBlocks: 200,
        //     skipDryRun: true,
        // },
        develop: {
            port: 8545,
        },
    },
    compilers: {
        solc: {
            version: '0.6.1',
        },
    },
};

module.exports = {
    livenet: {
        // url: 'https://mainnet.infura.io',
        url: 'http://222.200.180.184:8545',
        contractAddress: {},
    },
    livenet_private: {
        // url: 'https://sidechain.livenet.sonm.com',
        url: 'http://localhost:8545',
        contractAddress: {
            addressRegistry: '0xc8fed8603e0e6bf0d9a6b6c9b89606135f60ed71',
        },
    },
    rinkeby: {
        // url: 'https://rinkeby.infura.io',
        url: 'http://222.200.180.184:8545',
        contractAddress: {},
    },
    rinkeby_private: {
        // url: 'https://sidechain-dev.sonm.com',
        url: 'http://localhost:8545',
        contractAddress: {
            addressRegistry: '0xc8fed8603e0e6bf0d9a6b6c9b89606135f60ed71',
        },
    },
    testrpc: {
        url: 'https://proxy.test.sonm.com:8545',
        contractAddress: {},
    },
    testrpc_private: {
        url: 'https://proxy.test.sonm.com:8546',
        contractAddress: {
            addressRegistry: '0xc8fed8603e0e6bf0d9a6b6c9b89606135f60ed71',
        },
    },
};
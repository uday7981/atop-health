require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("./tasks")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.17",
    defaultNetwork: "mumbai",
    settings: { optimizer: { enabled: true, runs: 200 } },

    networks: {
        // hyperspace: {
        //     chainId: 3141,
        //     url: "https://api.hyperspace.node.glif.io/rpc/v1",
        //     accounts: [PRIVATE_KEY],
        // },
        mumbai: {
            chainId: 80001,
            url: "https://polygon-mumbai.g.alchemy.com/v2/XcG0U49rmR40kygsOE2Z2MrqtZxXYjGS",
            accounts: [PRIVATE_KEY],
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}

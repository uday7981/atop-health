const { ethers } = require("hardhat")

const networkConfig = {
    // 3141: {
    //     name: "hyperspace",
    //     tokensToBeMinted: 12000,
    // },
    80001: {
        name: "mumbai",
        tokensToBeMinted: 12000,
    },
}

// const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    // developmentChains,
}

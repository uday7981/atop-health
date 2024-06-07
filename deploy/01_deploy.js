require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("dotenv").config()

const { networkConfig } = require("../helper-hardhat-config")
console.log("hii")
const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

const main = async () => {
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId
    const tokensToBeMinted = networkConfig[chainId]["tokensToBeMinted"]

    //deploy TokenFactoryLibrary
    const TokenFactoryLibrary = await ethers.getContractFactory("TokenFactoryLibrary", wallet)
    console.log("Deploying TokenFactoryLibrary...")
    const tokenFactoryLibrary = await TokenFactoryLibrary.deploy()
    await tokenFactoryLibrary.deployed()
    console.log("TokenFactoryLibrary deployed to:", tokenFactoryLibrary.address)

    //deploy ParentStorage
    const ParentStorage = await ethers.getContractFactory(
        "ParentStorage",
        {
            libraries: {
                TokenFactoryLibrary: tokenFactoryLibrary.address,
            },
        },
        wallet
    )

    console.log("Deploying ParentStorage...")
    const demoUid = 1
    const parentStorage = await ParentStorage.deploy(demoUid)
    await parentStorage.deployed()
    console.log("ParentStorage deployed to:", parentStorage.address)
}

main().catch(console.error)

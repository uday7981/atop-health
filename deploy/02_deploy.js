require("hardhat-deploy")
require("hardhat-deploy-ethers")
require("dotenv").config()
const Web3 = require("web3")
const web3 = new Web3()

const { networkConfig } = require("../helper-hardhat-config")

const private_key = network.config.accounts[0]
const wallet = new ethers.Wallet(private_key, ethers.provider)

const main = async () => {
    console.log("Wallet Ethereum Address:", wallet.address)
    const chainId = network.config.chainId
    const tokensToBeMinted = networkConfig[chainId]["tokensToBeMinted"]

    //deploy TokenFactory
    const byteString = web3.utils.asciiToHex("Hello")
    const demoBytes = "0x" + web3.utils.padLeft(byteString.replace("0x", ""), 64)
    console.log(demoBytes)

    const ownerAddress = process.env.PUBLIC_KEY // Put public address of your account in .env file
    const uid = 0
    const TokenFactory = await ethers.getContractFactory("TokenFactory", wallet)
    console.log("Deploying TokenFactory...")
    console.log(ownerAddress)
    const tokenFactory = await TokenFactory.deploy(
        demoBytes,
        demoBytes,
        ownerAddress,
        21,
        demoBytes,
        demoBytes,
        demoBytes,
        demoBytes,
        uid
    )
    await tokenFactory.deployed()
    console.log("TokenFactory deployed to:", tokenFactory.address)
}

main().catch(console.error)

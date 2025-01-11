const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const Marketplace = await ethers.getContractFactory("Marketplace");
    
    // Deploy the contract
    const marketplace = await Marketplace.deploy();
    
    // Wait for deployment to finish
    await marketplace.waitForDeployment();

    console.log("Marketplace deployed to:", await marketplace.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

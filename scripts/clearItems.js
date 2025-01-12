const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const Marketplace = await hre.ethers.getContractAt(
    "Marketplace",
    contractAddress
  );

  // const tx = await Marketplace.clearItems();
  // await tx.wait();

  const count = await Marketplace.itemCount();
  console.log("All items cleared! Current Count: " + count.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

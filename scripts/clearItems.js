const hre = require("hardhat");

async function main() {
  const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const Marketplace = await hre.ethers.getContractAt(
    "Marketplace",
    contractAddress
  );

  const tx = await Marketplace.clearItems();
  await tx.wait();

  const count = await Marketplace.itemCount();
  console.log("All items cleared! Current Count: " + count.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

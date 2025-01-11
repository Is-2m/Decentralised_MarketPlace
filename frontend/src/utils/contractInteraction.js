// import { ethers } from "ethers";

// const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
// const contractABI = [
//   "function listItem(string memory _name, string memory _description, uint _price) public",
//   "function buyItem(uint _id) public payable",
//   "function items(uint) public view returns (uint id, address seller, string name, string description, uint price, bool isSold)",
//   "function itemCount() public view returns (uint)",
// ];

// let provider;
// let signer;
// let contract;

// export const initializeContract = async () => {
//   provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
//   signer = provider.getSigner();
//   contract = new ethers.Contract(contractAddress, contractABI, signer);
// };

// export const listItem = async (name, description, price) => {
//   try {
//     const tx = await contract.listItem(
//       name,
//       description,
//       ethers.utils.parseEther(price)
//     );
//     await tx.wait();
//     return true;
//   } catch (error) {
//     console.error("Error listing item:", error);
//     return false;
//   }
// };

// export const buyItem = async (id, price) => {
//   try {
//     const tx = await contract.buyItem(id, {
//       value: ethers.utils.parseEther(price),
//     });
//     await tx.wait();
//     return true;
//   } catch (error) {
//     console.error("Error buying item:", error);
//     return false;
//   }
// };

// export const getItems = async () => {
//   const itemCount = await contract.itemCount();
//   const items = [];
//   for (let i = 1; i <= itemCount; i++) {
//     const item = await contract.items(i);
//     items.push({
//       id: item.id.toNumber(),
//       seller: item.seller,
//       name: item.name,
//       description: item.description,
//       price: ethers.utils.formatEther(item.price),
//       isSold: item.isSold,
//     });
//   }
//   return items;
// };

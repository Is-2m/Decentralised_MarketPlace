import { ethers } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const contractABI = [
  "function listItem(string memory _name, string memory _description, uint _price) public",
  "function buyItem(uint _id) public payable",
  "function items(uint) public view returns (uint id, address seller, string name, string description, uint price, bool isSold)",
  "function itemCount() public view returns (uint)",
  "event ItemListed(uint id, address seller, string name, uint price)",
  "event ItemSold(uint id, address buyer, uint price)",
];

let provider;
let signer;
let contract;

export const initializeContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }

    // First add the Hardhat network if it doesn't exist
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x7a69",
            chainName: "Hardhat Local",
            nativeCurrency: {
              name: "Ethereum",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["http://127.0.0.1:8545/"],
            blockExplorerUrls: [],
          },
        ],
      });
    } catch (addError) {
      console.log("Chain may already exist:", addError);
    }

    // Now try to switch to the Hardhat network
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }],
      });
    } catch (switchError) {
      console.log("Switch chain error:", switchError);
      throw switchError;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Verify contract
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      throw new Error("Contract not deployed at this address");
    }

    return true;
  } catch (error) {
    console.error("Init error:", error);
    throw error;
  }
};

export const listItem = async (name, description, price) => {
  try {
    if (!contract) {
      await initializeContract();
    }

    const tx = await contract.listItem(
      name,
      description,
      ethers.utils.parseEther(price)
    );
    await tx.wait();

    const itemCount = await contract.itemCount();
    return itemCount.toNumber();
  } catch (error) {
    console.error("Error listing item:", error);
    throw error;
  }
};

export const buyItem = async (id) => {
  try {
    if (!contract) {
      await initializeContract();
    }

    const item = await contract.items(id);
    if (!item.seller) {
      throw new Error("Item not found");
    }

    const tx = await contract.buyItem(id, {
      value: item.price,
    });

    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error buying item:", error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    if (!contract) {
      await initializeContract();
    }

    const itemCount = await contract.itemCount();
    const items = [];

    for (let i = 1; i <= itemCount; i++) {
      const item = await contract.items(i);
      items.push({
        id: item.id.toNumber(),
        seller: item.seller,
        name: item.name,
        description: item.description,
        price: ethers.utils.formatEther(item.price),
        isSold: item.isSold
      });
    }

    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const getItemById = async (id) => {
  try {
    if (!contract) {
      await initializeContract();
    }

    const item = await contract.items(id);
    if (!item.seller) {
      return null;
    }

    return {
      id: item.id.toNumber(),
      seller: item.seller,
      name: item.name,
      description: item.description,
      price: ethers.utils.formatEther(item.price),
      isSold: item.isSold
    };
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};
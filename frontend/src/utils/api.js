import { ethers } from "ethers";

const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

const contractABI = [
  "function listItem(string memory _name, string memory _description, uint _price) public",
  "function buyItem(uint _id) public payable",
  "function items(uint) public view returns (uint id, address seller, string name, string description, uint price, bool isSold)",
  "function itemCount() public view returns (uint)",
  "function clearItems() public",
  "event ItemsCleared()",
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
            chainId: "0x7a69", // 31337 in hex
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

    console.log("Connected chainId:", window.ethereum.chainId);

    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("Ethereum provider initialized");
    } catch (error) {
      console.error("Error initializing provider:", error);
      throw error;
    }

    await provider.send("eth_requestAccounts", []);

    const network = await provider.getNetwork();
    console.log("Network:", network);

    const blockNumber = await provider.getBlockNumber();
    console.log("Block number:", blockNumber);

    signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("Signer address:", address);

    contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Verify contract
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      throw new Error("Contract not deployed at this address");
    }

    await syncContractWithDatabase();
    console.log("Items synced successfully");

    return true;
  } catch (error) {
    console.error("Init error:", error);
    throw error;
  }
};

export const listItem = async (name, description, price) => {
  try {
    const tx = await contract.listItem(
      name,
      description,
      ethers.utils.parseEther(price)
    );
    await tx.wait();

    const itemCount = await contract.itemCount();
    const newItemId = itemCount.toNumber();

    const newItem = {
      id: newItemId,
      name,
      description,
      price,
      seller: await signer.getAddress(),
      isSold: false,
    };

    // Add to JSON server
    await addItem(newItem);

    return newItemId;
  } catch (error) {
    console.error("Error listing item:", error);
    return null;
  }
};

export const buyItem = async (id) => {
  try {
    // First check if contract is initialized
    if (!contract) {
      await initializeContract();
    }

    const item = await getItemById(id);
    if (!item) {
      throw new Error("Item not found in database");
    }

    console.log("Found item:", item);

    // Verify item exists on blockchain
    const chainItem = await contract.items(id);
    console.log("Chain item:", chainItem);

    if (!chainItem.seller) {
      throw new Error("Item not found on blockchain");
    }

    const price = ethers.utils.parseEther(item.price.toString());
    console.log("Sending transaction with value:", price.toString());

    const tx = await contract.buyItem(id, {
      value: price,
    });

    console.log("Transaction sent:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");

    // Update item in JSON server
    item.isSold = true;
    await updateItem(id, item);

    return true;
  } catch (error) {
    console.error("Error buying item:", error);
    throw error; // Propagate error to component
  }
};

export const getItems = async () => {
  try {
    const response = await fetch("http://localhost:3001/items");
    return await response.json();
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

export const getItemById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3001/items?id=${id}`);
    const items = await response.json();
    return items[0] || null;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
};

export const addItem = async (item) => {
  try {
    const response = await fetch("http://localhost:3001/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding item:", error);
    return null;
  }
};

export const updateItem = async (id, item) => {
  try {
    const response = await fetch(`http://localhost:3001/items/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating item:", error);
    return null;
  }
};

export const syncContractWithDatabase = async () => {
  try {
    if (!contract) {
      await initializeContract();
    }

    // 1. Get current contract state
    const contractItemCount = await contract.itemCount();
    console.log("Contract item count:", contractItemCount.toString());

    // 2. Get database items
    const dbItems = await getItems();
    console.log("Database items:", dbItems);

    // 3. Compare and sync
    const contractItems = [];
    for (let i = 1; i <= contractItemCount; i++) {
      const item = await contract.items(i);
      contractItems.push({
        id: item.id.toNumber(),
        seller: item.seller,
        name: item.name,
        description: item.description,
        price: ethers.utils.formatEther(item.price),
        isSold: item.isSold,
      });
    }

    // 4. Add missing items to contract
    for (const dbItem of dbItems) {
      const existsInContract = contractItems.some(
        (contractItem) =>
          contractItem.name === dbItem.name &&
          contractItem.description === dbItem.description &&
          contractItem.price === dbItem.price.toString()
      );

      if (!existsInContract) {
        console.log(`Adding missing item to contract: ${dbItem.name}`);
        try {
          const tx = await contract.listItem(
            dbItem.name,
            dbItem.description,
            ethers.utils.parseEther(dbItem.price.toString())
          );
          await tx.wait();
          console.log(`Added item ${dbItem.name} to contract`);
        } catch (error) {
          console.error(`Error adding item ${dbItem.name}:`, error);
        }
      }
    }

    // 5. Update database with contract items' sold status
    for (const contractItem of contractItems) {
      const dbItem = dbItems.find(
        (item) =>
          item.name === contractItem.name &&
          item.description === contractItem.description
      );

      if (dbItem && dbItem.isSold !== contractItem.isSold) {
        await updateItem(dbItem.id, {
          ...dbItem,
          isSold: contractItem.isSold,
        });
        console.log(`Updated item ${dbItem.id} sold status in database`);
      }
    }

    return true;
  } catch (error) {
    console.error("Sync error:", error);
    throw error;
  }
};

export const countItemsInContract = async () => {
  try {
    // console.log("Starting simple test...");

    // await initializeContract();

    console.log("Getting item count...");
    const count = await contract.itemCount();
    console.log("Current item count:", count.toString());

    // console.log("Attempting to list item...");
    // const tx = await contract.listItem(
    //   "Test Item",
    //   "Test Description",
    //   ethers.utils.parseEther("0.1")
    // );
    return true;
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
};

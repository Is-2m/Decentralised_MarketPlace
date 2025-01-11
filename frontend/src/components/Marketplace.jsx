import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// For local hardhat network
const CONTRACT_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
// You'll need to copy your ABI from artifacts/contracts/Marketplace.sol/Marketplace.json
const CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "buyer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "ItemSold",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "seller",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "ItemListed",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "buyItem",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "itemCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "items",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "seller",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isSold",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_price",
          "type": "uint256"
        }
      ],
      "name": "listItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

function Marketplace() {
    const [account, setAccount] = useState('');
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        connectWallet();
        loadItems();
    }, []);

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);

                // Request network switch to localhost:8545
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x7A69' }], // 31337 in hex
                });
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install MetaMask!");
        }
    }

    async function loadItems() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            
            const itemCount = await contract.itemCount();
            const loadedItems = [];

            for (let i = 1; i <= itemCount; i++) {
                const item = await contract.items(i);
                loadedItems.push({
                    id: item.id.toNumber(),
                    seller: item.seller,
                    name: item.name,
                    description: item.description,
                    price: ethers.utils.formatEther(item.price),
                    isSold: item.isSold
                });
            }

            setItems(loadedItems);
            setLoading(false);
        } catch (error) {
            console.error("Error loading items:", error);
            setLoading(false);
        }
    }

    async function listItem(e) {
        e.preventDefault();
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const price = ethers.utils.parseEther(newItem.price);
            const tx = await contract.listItem(newItem.name, newItem.description, price);
            await tx.wait();

            setNewItem({ name: '', description: '', price: '' });
            loadItems();
        } catch (error) {
            console.error("Error listing item:", error);
        }
    }

    async function buyItem(id, price) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const tx = await contract.buyItem(id, {
                value: ethers.utils.parseEther(price)
            });
            await tx.wait();

            loadItems();
        } catch (error) {
            console.error("Error buying item:", error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Marketplace Décentralisée</h1>
            
            {!account ? (
                <button 
                    onClick={connectWallet}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Connect Wallet
                </button>
            ) : (
                <p className="mb-4">Connected Account: {account}</p>
            )}

            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">List New Item</h2>
                <form onSubmit={listItem} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        className="block w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                        className="block w-full p-2 border rounded"
                    />
                    <input
                        type="text"
                        placeholder="Price (ETH)"
                        value={newItem.price}
                        onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                        className="block w-full p-2 border rounded"
                    />
                    <button 
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        List Item
                    </button>
                </form>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4">Available Items</h2>
                {loading ? (
                    <p>Loading items...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map(item => (
                            <div key={item.id} className="border p-4 rounded">
                                <h3 className="font-bold">{item.name}</h3>
                                <p>{item.description}</p>
                                <p>Price: {item.price} ETH</p>
                                <p>Seller: {item.seller}</p>
                                {!item.isSold ? (
                                    <button
                                        onClick={() => buyItem(item.id, item.price)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                    >
                                        Buy Item
                                    </button>
                                ) : (
                                    <p className="text-red-500">Sold</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Marketplace;
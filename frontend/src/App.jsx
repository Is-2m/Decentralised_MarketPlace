import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MarketplaceABI from './MarketplaceABI.json';
import ListItem from './components/ListItem';
import ItemList from './components/ItemList';
import ConnectWallet from './components/ConnectWallet';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);

  const contractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          setAccount(accounts[0]);

          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const marketplaceContract = new ethers.Contract(
            contractAddress,
            MarketplaceABI,
            signer
          );

          setContract(marketplaceContract);
          await loadItems(marketplaceContract);
        } catch (error) {
          console.error('Error initializing:', error);
        }
      }
    };

    init();
  }, []);

  const loadItems = async (marketplaceContract) => {
    try {
      const itemCount = await marketplaceContract.itemCount();
      const loadedItems = [];

      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplaceContract.items(i);
        loadedItems.push({
          id: item.id,
          seller: item.seller,
          name: item.name,
          description: item.description,
          price: item.price,
          isSold: item.isSold,
        });
      }

      setItems(loadedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Marketplace Décentralisée</h1>
      <ConnectWallet account={account} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">List an Item</h2>
          <ListItem contract={contract} onItemListed={() => loadItems(contract)} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Available Items</h2>
          <ItemList 
            items={items} 
            contract={contract} 
            onItemBought={() => loadItems(contract)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
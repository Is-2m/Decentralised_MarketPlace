import React, { useState, useEffect } from 'react';
import { initializeContract, getItems } from './utils/contractInteraction';
import ListItemForm from './components/ListItemForm';
import ItemList from './components/ItemList';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      await initializeContract();
      await fetchItems();
    };
    init();
  }, []);

  const fetchItems = async () => {
    const fetchedItems = await getItems();
    setItems(fetchedItems);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Decentralized Marketplace</h1>
      <ListItemForm onItemListed={fetchItems} />
      <ItemList items={items} onItemBought={fetchItems} />
    </div>
  );
}

export default App;
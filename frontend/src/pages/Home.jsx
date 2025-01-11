import React, { useState, useEffect } from 'react';
import { getItems } from '../utils/api';
import ItemList from '../components/ItemList';

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Items</h1>
      <ItemList items={items} />
    </div>
  );
};

export default Home;
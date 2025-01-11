import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getItemById } from '../utils/api';
import ItemDetails from '../components/ItemDetails';

const ItemPage = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchItem = async () => {
      const fetchedItem = await getItemById(id);
      setItem(fetchedItem);
    };
    fetchItem();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Item Details</h1>
      <ItemDetails item={item} />
    </div>
  );
};

export default ItemPage;
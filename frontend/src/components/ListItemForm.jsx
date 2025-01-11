import React, { useState } from 'react';
import { listItem } from '../utils/contractInteraction';

const ListItemForm = ({ onItemListed }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await listItem(name, description, price);
    if (success) {
      setName('');
      setDescription('');
      setPrice('');
      onItemListed();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Item Name"
        className="mb-2 p-2 border rounded"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="mb-2 p-2 border rounded"
        required
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (ETH)"
        className="mb-2 p-2 border rounded"
        required
        step="0.01"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">List Item</button>
    </form>
  );
};

export default ListItemForm;
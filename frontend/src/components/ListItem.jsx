import { useState } from 'react';
import { ethers } from 'ethers';

function ListItem({ contract, onItemListed }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await contract.listItem(name, description, priceInWei);
      await tx.wait();
      setName('');
      setDescription('');
      setPrice('');
      onItemListed();
    } catch (error) {
      console.error('Error listing item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-2">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-2">Price (ETH):</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        List Item
      </button>
    </form>
  );
}

export default ListItem;
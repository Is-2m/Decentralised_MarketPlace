import React, { useState } from 'react';
import { buyItem } from '../utils/api';
import { useNavigate } from 'react-router-dom';


const BuyItemButton = ({ id, price }) => {
  console.log("Button rendered with id:", id, "price:", price);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    setError('');
    setIsLoading(true);
    try {
      const success = await buyItem(id);
      if (success) {
        alert('Item purchased successfully!');
        navigate('/');
      } else {
        setError('Failed to purchase item. Please try again.');
      }
    } catch (err) {
      setError(`[BuyItemButton] Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={isLoading}
        className={`px-4 py-2 rounded transition duration-300 ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {isLoading ? 'Processing...' : `Buy for ${price} ETH`}
      </button>


            {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default BuyItemButton;
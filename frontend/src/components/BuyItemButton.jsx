import React from 'react';
import { buyItem } from '../utils/contractInteraction';

const BuyItemButton = ({ id, price, onItemBought }) => {
  const handleBuy = async () => {
    const success = await buyItem(id, price);
    if (success) {
      onItemBought();
    }
  };

  return (
    <button onClick={handleBuy} className="bg-green-500 text-white p-2 rounded">
      Buy for {price} ETH
    </button>
  );
};

export default BuyItemButton;
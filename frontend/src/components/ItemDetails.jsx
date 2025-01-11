import React from 'react';
import BuyItemButton from './BuyItemButton';
import {countItemsInContract } from '../utils/api';

const ItemDetails = ({ item }) => {
  if (!item) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
      <p className="text-gray-600 mb-4">{item.description}</p>
      <p className="text-xl font-semibold mb-4">Price: {item.price} ETH</p>
      <p className="text-gray-600 mb-4">Seller: {item.seller}</p>
      {!item.isSold ? (
        <BuyItemButton id={item.id} price={item.price} />
      ) : (
        <p className="text-red-500 font-semibold">Sold</p>
      )}


<br />
<button 
  onClick={countItemsInContract}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Simple Test
</button>

    </div>
  );
};

export default ItemDetails;
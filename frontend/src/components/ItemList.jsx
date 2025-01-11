import React from 'react';
import BuyItemButton from './BuyItemButton';

const ItemList = ({ items, onItemBought }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Listed Items</h2>
      {items.map((item) => (
        <div key={item.id} className="border p-4 mb-4 rounded">
          <h3 className="font-bold">{item.name}</h3>
          <p>{item.description}</p>
          <p>Price: {item.price} ETH</p>
          <p>Seller: {item.seller}</p>
          {!item.isSold ? (
            <BuyItemButton id={item.id} price={item.price} onItemBought={onItemBought} />
          ) : (
            <p className="text-red-500">Sold</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
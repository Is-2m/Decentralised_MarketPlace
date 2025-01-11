import React from 'react';
import { Link } from 'react-router-dom';

const ItemList = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg shadow-md p-6 bg-white">
          <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <p className="text-lg font-bold mb-4">{item.price} ETH</p>
          <Link
            to={`/item/${item.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
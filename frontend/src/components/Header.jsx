import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Decentralized Marketplace</Link>
        <div>
          <Link to="/" className="px-4 py-2 hover:bg-gray-700 rounded">Home</Link>
          <Link to="/list-item" className="px-4 py-2 hover:bg-gray-700 rounded">List Item</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
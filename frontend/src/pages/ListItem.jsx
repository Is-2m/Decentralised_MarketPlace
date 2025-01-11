import React from 'react';
import ListItemForm from '../components/ListItemForm';

const ListItem = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">List a New Item</h1>
      <ListItemForm />
    </div>
  );
};

export default ListItem;
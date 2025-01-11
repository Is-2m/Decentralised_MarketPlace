import { ethers } from 'ethers';

function ItemList({ items, contract, onItemBought }) {
  const buyItem = async (id, price) => {
    try {
      const tx = await contract.buyItem(id, { value: price });
      await tx.wait();
      onItemBought();
    } catch (error) {
      console.error('Error buying item:', error);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="border p-4 rounded">
          <h3 className="font-bold">{item.name}</h3>
          <p>{item.description}</p>
          <p>Price: {ethers.formatEther(item.price)} ETH</p>
          <p>Seller: {item.seller}</p>
          {!item.isSold ? (
            <button
              onClick={() => buyItem(item.id, item.price)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
            >
              Buy
            </button>
          ) : (
            <span className="text-red-500">Sold</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default ItemList;
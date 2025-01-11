function ConnectWallet({ account }) {
    return (
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">Wallet Connection</h2>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <p>Please connect your MetaMask wallet</p>
        )}
      </div>
    );
  }
  
  export default ConnectWallet;
# Decentralised Marketplace

## Description

This project is a **decentralized marketplace application** built using Solidity for the smart contract, Hardhat for development and deployment, and React for the frontend interface. It allows users to list items for sale and purchase them using cryptocurrency.

## Key Features

- **Item Listing**: Users can list items for sale by providing a name, description, and price. The `listItem` function in the `Marketplace` contract handles this functionality.
- **Item Purchasing**: Users can purchase listed items using cryptocurrency. The `buyItem` function in the `Marketplace` contract facilitates this transaction.
- **Browse Items**: Users can browse all listed items and view individual item details.
- **Smart Contract**: The core logic is implemented in the `Marketplace.sol` Solidity smart contract.
- **Frontend Interface**: The user interface is built with React, allowing users to interact with the smart contract seamlessly.

## Technologies Used

- **Solidity**: For writing the smart contract.
- **Hardhat**: For smart contract development, testing, and deployment.
- **React**: For building the user interface.
- **ethers.js**: For interacting with the smart contract from the frontend.
- **Vite**: For bundling the frontend application.
- **Node.js**: For running scripts and managing dependencies.

## Project Structure

```
contracts/                # Contains the Solidity smart contract (Marketplace.sol)
scripts/                  # Contains deployment scripts (deploy.js)
frontend/                 # Contains the React frontend application
  └── src/
      ├── components/     # Contains reusable React components (e.g., BuyItemButton, Footer/
      ├── pages/          # Contains different pages of the application (e.g., Home, ItemPage)
      └── utils/          # Contains utility files (e.g., API interaction (api.js))
hardhat.config.js         # Configuration for Hardhat
package.json              # Project dependencies and scripts
vite.config.js            # Configuration for Vite bundler
```

## Setup Instructions

1. **Install dependencies**:

    ```bash
    npm install
    cd frontend
    npm install
    cd ..
    ```

2. **Start the Hardhat node**:

    ```bash
    npx hardhat node
    ```

    This command starts a local Ethereum node using Hardhat.

3. **Compile and Deploy the smart contract**:

    ```bash
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network localhost
    ```

    This command deploys the `Marketplace` smart contract to the local Hardhat network.

4. **Start the frontend application**:

    ```bash
    cd frontend
    npm run dev
    ```

    This command starts the React frontend application using Vite.

5. **Access the application**: 

    Open your web browser and navigate to the address provided by the frontend development server (usually [http://localhost:5173](http://localhost:5173)).

## Smart Contract Details

- The `Marketplace.sol` contract manages items for sale.
- It has functions to:
  - **List an item**: `listItem`
  - **Buy an item**: `buyItem`
  - **Clear all items**: `clearItems`
- The contract uses a `mapping` to store item data and emits events for significant actions such as listing (`ItemListed`), selling (`ItemSold`), and clearing items (`ItemsCleared`).

## Frontend Details

- Built with React, the frontend interacts with the smart contract via `ethers.js`.
- Key frontend components:
  - `ItemList`: Displays the list of all items.
  - `ItemDetails`: Displays the details of a specific item.
  - `ListItemForm`: Allows users to list new items.
  - `api.js`: Contains functions like `listItem`, `buyItem`, `getItems`, and `getItemById` for interacting with the smart contract.

## Troubleshooting

- **MetaMask Issues**: Ensure MetaMask is connected to the Hardhat Local network.
- **Contract Not Found**: Ensure that the contract is deployed to the correct address.
- **Smart Contract Interaction Errors**: Check console logs and transaction details on the blockchain.

## Additional Information

- **Mock JSON Server**: The `json-server` command mentioned in the setup is not used as the data is handled on the blockchain via the smart contract.
- **Linting**: The project includes ESLint configurations for code quality and best practices.
- **Hardhat Configuration**: `hardhat.config.js` configures the Hardhat development environment.

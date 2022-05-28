# [fundraiser-dapp-eth](https://fundraiser-dapp.netlify.app/)


A **Decentralized Fundraiser Application** developed in _Truffle_ framework and front-end in _ReactJS_.

The application essentially provides a decentralized platform where users can Create Fundraisers by adding the required details and Donate to the existing Fundraisers. The donation amount is stored in the smart-contract till either the Goal set by the host is completed or the Expiry date set by the Host is passed. If the Goal amount is reached before the Expiry date, the collected funds are transferred to the Benificiary's address. Incase where the goal doesn't meet by the Expiry date, funds collected are refunded to the respective donors.

- The smart-contracts are deployed on the _Ropsten Test Network_ of the **Ethereum blockchain**
- Deployment to blockchain is done via [Infura](https://infura.io/)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) framework is used for local development
- Frontend React application is deployed here - https://fundraiser-dapp.shan10u.com/
- [Metamask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en) is required to connect with the blockchain
- User needs to have some Test Ethers from the Ropsten Test Network of Ethereum Blockchain to perform a transaction. You can get some free test etheres at [Metamask Faucet](https://faucet.metamask.io/)
- The Track page uses [Etherscan API](https://etherscan.io/apis)

### Demo 

https://user-images.githubusercontent.com/48870803/132816901-81f73f37-0f7d-444e-b074-862271d82586.mp4

---

### How to use

Use `npm install truffle -g` to install the [Truffle framework](https://www.trufflesuite.com/docs/truffle/overview)

Use `npm install` in root directory to install dev dependencies required for deploying the smart-contracts

Use `cd client/` to navigate into the front-end directory and `npm install` to install all the required node modules for the React App

Use `truffle develop` to create a local Blockchain

Use `migrate --reset` to deploy the smart-contracts inside the contracts/ directory on the local blockcahin

Use `npm start` in the client directory to start the React App

Rename `.env_example` to `.env` in the client directory and add the API key from [Etherscan API](https://etherscan.io/apis) to use the Track feature

---

### How to deploy on ethereum network

Rename the `.secret_example` to `.secrets` and update it with the required details. You will need to create an account on [Infura](https://infura.io/)

Use `truffle deploy --network ropsten` or `truffle migrate --network ropsten` to deploy the smart-contracts on the Ropsten network

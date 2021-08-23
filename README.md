# The Graph Badges

Badgeth is a dApp for identifying and rewarding noteworthy behavior on the Ethereum blockchain by issuing NFT badges. This repo houses the subgraph responsible for monitoring and rewarding users within The Graph protocol. For more information, please visit our [website](https://badgeth.com) or join our [Discord](https://discord.gg/464p6GzrWq).

## Setup

1. Install dependencies

```bash
npm i
```

2. Start your local graph-node. If you have a M1 Macbook, please talk with us on Discord for some custom workarounds for the following steps.

   - Clone graph-node

   ```bash
   git clone https://github.com/graphprotocol/graph-node
   ```

   - Sign up for [Alchemy](https://alchemy.com) and create your own Ethereum node. You can alternatively use your own Ethereum node if you have the hardware.

   - Edit your graph-node/docker/docker-compose.yml file. Change the "ethereum" environment variable to point to your Ethereum node. If you are using Alchemy, be sure to update <YOUR_API_KEY> and change <YOUR_NETWORK> to "mainnet" or "rinkeby".

   ```bash
   ...
   ...
   graph-node:
   ...
   ...
    environment:
      ...
      ...
      # ethereum: 'mainnet:http://host.docker.internal:8545'
      ethereum: "<YOUR_NETWORK>:https://eth-rinkeby.alchemyapi.io/v2/<YOUR_API_KEY>"
      ...
      ...
   ...
   ...
   ```

   - Start your docker processes

   ```bash
   docker-compose up
   ```

3. Create your subgraph.yaml on Rinkeby or Mainent

Option A: Rinkeby

```bash
npm run prep:addresses:rinkeby
```

Option B: Mainnet

```bash
npm run prep:addresses:mainnet
```

4. Generate code & build your subgraph

```bash
npm run build
```

5. Deploy Locally

```bash
npm run create-local
npm run deploy-local
```

6. Authenticate

```bash
graph auth  --studio <YOUR_AUTH_TOKEN_HERE>
```

7. Deploy to The Graph Studio. Authentication to our Studio account required.

Option A: Rinkeby

```bash
npm run deploy-dev
```

Option B: Mainnet

```bash
npm run deploy
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

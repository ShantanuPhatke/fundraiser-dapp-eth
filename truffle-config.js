const path = require("path")
const fs = require("fs")

const HDWalletProvider = require("@truffle/hdwallet-provider")
const secrets = JSON.parse(fs.readFileSync(".secrets").toString().trim())

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contractBuilds"),
  networks: {
    develop: {
      port: 8545,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          secrets.seed,
          `https://ropsten.infura.io/v3/${secrets.infuraProjectId}`
        ),
      network_id: 3,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.1",
    },
  },
}

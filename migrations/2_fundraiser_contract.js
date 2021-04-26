var FundraiserStore = artifacts.require("./FundraiserStore.sol");

module.exports = function(deployer) {
  deployer.deploy(FundraiserStore);
};

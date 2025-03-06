var Bank = artifacts.require("Bank.sol");
var name = "Mashashi Kishimoto";

module.exports = function (deployer) {
  deployer.deploy(Bank, name);
};

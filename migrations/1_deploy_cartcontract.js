var CartManager = artifacts.require('./CartManager.sol');

module.exports = function (deployer) {
    deployer.deploy(CartManager);
};

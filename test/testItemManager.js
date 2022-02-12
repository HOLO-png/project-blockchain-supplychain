const ItemManager = artifacts.require("./ItemManager.sol");

contract('ItemManager', (accounts) => {
    it('should be deployed', async function () {
        const itemManagerInstance = await ItemManager.deployed();
        assert(itemManagerInstance.address !== '');
    });

    it('...should be able to add an Item', async function () {
        const itemManagerInstance = await ItemManager.deployed();
        const itemName = 'test 1';
        const itemPrice = 500;
        const itemImage =
            'http://aimory.vn/wp-content/uploads/2017/10/no-image.png';
        const ownerAddress = accounts[0];

        const result = await itemManagerInstance.createItem(
            itemName,
            itemImage,
            itemPrice,
            ownerAddress,
            { from: accounts[0] },
        );
        assert.equal(
            result.logs[0].args._itemIndex,
            0,
            'it is not the first item',
        );
        console.log(result);

        const item = await itemManagerInstance.items(0);
        assert.equal(
            item._identifier,
            itemName,
            'The identifier was different',
        );
        assert.equal(item._image, itemImage, 'The image was different');
        assert.equal(item._itemPrice, itemPrice, 'The price was different');
    });
});
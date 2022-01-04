import React, { Component } from 'react';
import ItemManagerContract from './contracts/ItemManager.json';
import ItemContract from './contracts/Item.json';
import ListItem from './components/ListItem';
import FormEdit from './components/FormEdit';
import getWeb3 from './getWeb3';

import './App.css';
import { imageUpload } from './utils/imageUpload';

class App extends Component {
    state = {
        loaded: false,
        listItems: [],
        isFormEditItem: false,
        productName: '',
        productPrice: '',
        indexItemEdit: null,
        isEdit: false,
        image: '',
    };

    componentDidMount = async () => {
        try {
            this.web3 = await getWeb3();

            this.accounts = await this.web3.eth.getAccounts();

            this.networkId = await this.web3.eth.net.getId();

            this.itemManager = new this.web3.eth.Contract(
                ItemManagerContract.abi,
                ItemManagerContract.networks[this.networkId] &&
                    ItemManagerContract.networks[this.networkId].address,
            );

            this.item = new this.web3.eth.Contract(
                ItemContract.abi,
                ItemContract.networks[this.networkId] &&
                    ItemContract.networks[this.networkId].address,
            );
            this.setState({ loaded: true });
            this.getList();
        } catch (error) {
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    getList = async () => {
        let indexItem = await this.itemManager.methods.getItemIndex().call();

        let newlist = [];

        for (let i = 0; i < indexItem; i++) {
            let itemObject = await this.itemManager.methods.items(i).call();
            if (
                itemObject._identifier !== '' &&
                itemObject._itemPrice !== '0'
            ) {
                let item = new this.web3.eth.Contract(
                    ItemContract.abi,
                    itemObject._itemAddress,
                );

                let addressOwner = await item.methods.addressOwner().call();

                const newItem = {
                    index: i,
                    identifier: itemObject._identifier,
                    price: itemObject._itemPrice,
                    image: itemObject._image,
                    step: itemObject._state,
                    addressItem: itemObject._itemAddress,
                    ownerAddress: addressOwner,
                };

                newlist.push(newItem);
            }
        }
        this.setState({
            listItems: newlist,
        });
    };

    listenToPaymentEvent = () => {
        let self = this;
        this.itemManager.events
            .SupplyChainStep()
            .on('data', async function (evt) {
                let itemObject = await self.itemManager.methods
                    .items(evt.returnValues._itemIndex)
                    .call();
                alert(
                    'Item ' +
                        itemObject._identifier +
                        'was paid, deliver it now',
                );
            });
    };

    handleInputChange = (event) => {
        const target = event.target;
        const value =
            target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    handleSubmitFormEdit = async () => {
        if (this.state.isEdit) {
            const { productName, productPrice, indexItemEdit, image } =
                this.state;
            let media = image;
            if (image.name) {
                media = await imageUpload(image);
            }
            console.log(media);

            try {
                await this.itemManager.methods
                    .updateItem(
                        indexItemEdit,
                        productName,
                        media,
                        +productPrice,
                    )
                    .send({ from: this.accounts[0] });

                alert('Updated Item');
            } catch (e) {
                alert('Updated failed ');
            }
            this.getList();
            this.handleHiddenFormEdit();
        } else {
            const { image } = this.state;
            let media =
                'http://aimory.vn/wp-content/uploads/2017/10/no-image.png';
            if (image) {
                media = await imageUpload(image);
            }
            try {
                const { productPrice, productName } = this.state;

                let result = await this.itemManager.methods
                    .createItem(
                        productName,
                        media,
                        +productPrice,
                        this.accounts[0],
                    )
                    .send({ from: this.accounts[0] });

                const itemIndex =
                    result.events.SupplyChainStep.returnValues._itemIndex;
                const step = result.events.SupplyChainStep.returnValues._step;
                const address =
                    result.events.SupplyChainStep.returnValues._itemAddress;

                const newItem = {
                    index: +itemIndex,
                    identifier: productName,
                    price: +productPrice,
                    image: media,
                    step: step,
                    addressItem: address,
                    ownerAddress: this.accounts[0],
                };

                this.setState((prevState) => ({
                    listItems: [...prevState.listItems, newItem],
                }));
                this.handleHiddenFormEdit();
                alert(
                    'Send ' +
                        productPrice +
                        ' Wei to ' +
                        result.events.SupplyChainStep.returnValues._itemAddress,
                );
            } catch (err) {
                alert(err.message);
                this.handleHiddenFormEdit();
            }
        }
    };

    handCLickPaid = async (item) => {
        try {
            await this.itemManager.methods.triggerPayment(item.index).send({
                to: item.addressItem,
                value: item.price,
                from: this.accounts[0],
            });
            const newListItem = this.state.listItems.map((obj) =>
                obj.addressItem === item.addressItem
                    ? { ...item, step: '1' }
                    : obj,
            );

            this.setState({
                listItems: newListItem,
            });
            alert('Paided item: ' + item.addressItem);
        } catch (e) {
            alert('Delivered failed ');
        }
    };

    handCLickDelivered = async (item) => {
        try {
            await this.itemManager.methods
                .triggerDelivery(item.index)
                .send({ from: this.accounts[0] });

            const newListItem = this.state.listItems.map((obj) =>
                obj.addressItem === item.addressItem
                    ? { ...item, step: '2' }
                    : obj,
            );

            this.setState({
                listItems: newListItem,
            });
            alert('Delivered item: ' + item.addressItem);
            this.getList();
        } catch (e) {
            alert('Delivered failed ');
        }
    };

    handleRemoveItem = async (item) => {
        try {
            await this.itemManager.methods
                .removeItem(item.index)
                .send({ from: this.accounts[0] });
            alert('Deleted Item: ' + item.addressItem);
            this.getList();
        } catch (e) {
            alert('Delete failed ');
        }
    };

    handleEditItem = async (item) => {
        this.setState({
            isFormEditItem: true,
            isEdit: true,
            image: item.image,
            productName: item.identifier,
            productPrice: item.price,
            indexItemEdit: item.index,
        });
    };

    handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ image: file });
        } else {
            alert('Upload file failed! ');
        }
    };

    handleHiddenFormEdit = () => {
        this.setState({
            isFormEditItem: false,
            isEdit: false,
            image: '',
            productName: '',
            productPrice: '',
            indexItemEdit: null,
        });
    };

    handleShowFormCreateItem = () => {
        this.setState({
            isFormEditItem: true,
        });
    };

    render() {
        console.log(this.state.listItems);

        if (!this.state.loaded) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div>
                <div id="create">
                    <h1>My Supply Chain</h1>

                    <div id="container">
                        <button
                            type="button"
                            // onClick={this.handleSubmit}
                            onClick={this.handleShowFormCreateItem}
                            className="create-btn"
                        >
                            Create new Item
                        </button>
                    </div>
                </div>
                <ListItem
                    listItems={this.state.listItems}
                    itemManager={this.itemManager}
                    handCLickPaid={this.handCLickPaid}
                    handCLickDelivered={this.handCLickDelivered}
                    handleRemoveItem={this.handleRemoveItem}
                    handleEditItem={this.handleEditItem}
                ></ListItem>
                {this.state.isFormEditItem && (
                    <FormEdit
                        handleHiddenFormEdit={this.handleHiddenFormEdit}
                        handleInputChange={this.handleInputChange}
                        productName={this.state.productName}
                        productPrice={this.state.productPrice}
                        handleSubmitFormEdit={this.handleSubmitFormEdit}
                        handleChangeImage={this.handleChangeImage}
                        image={this.state.image}
                    />
                )}
            </div>
        );
    }
}

export default App;

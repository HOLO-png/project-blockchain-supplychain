import React, { Component } from 'react';
import ItemManagerContract from '../../contracts/ItemManager.json';
import ItemContract from '../../contracts/Item.json';
import ListItem from '../../components/Item/ListItem';
import FormEdit from '../../components/FormEditItem/FormEdit';

import './styles.css';
import { imageUpload } from '../../utils/imageUpload';
import { Button } from 'reactstrap';
import {
    setLoadingFalse,
    setLoadingTrue,
} from '../../redux/reducers/loadingReducer';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
    createProductApi,
    deleteProductApi,
    getProductApi,
    getUserAllProductApi,
    updateStatusProductApi,
} from '../../redux/reducers/productReducer';
import TableProduct from '../../components/TableProduct';

class Home extends Component {
    state = {
        isFormEditItem: false,
        productName: '',
        productPrice: '',
        productEdit: null,
        isEdit: false,
        image: '',
    };
    //=============================

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
        this.props.toggleLoadingTrue();
        if (this.props.web3) {
            if (this.state.isEdit) {
                const { productName, productPrice, productEdit, image } =
                    this.state;
                let media = image;
                if (image.name) {
                    media = await imageUpload(image);
                }
                console.log(productName, productPrice, productEdit, image);

                try {
                    await this.itemManager.methods
                        .updateItem(
                            productEdit.indexProduct,
                            productName,
                            media,
                            +productPrice,
                        )
                        .send({ from: this.accounts[0] });
                    this.props.handleUpdateProductApi({
                        ...productEdit,
                        thumbnail: media,
                        name: productName,
                        price: productPrice,
                    });
                } catch (e) {
                    toast.error('Updated failed ');
                }
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

                    console.log(productName, media, +productPrice);

                    let result = await this.itemManager.methods
                        .createItem(
                            productName,
                            media,
                            +productPrice,
                            this.accounts[0],
                        )
                        .send({
                            from: this.accounts[0],
                            // gas: 6000000,
                        });

                    const itemIndex =
                        result.events.SupplyChainStep.returnValues._itemIndex;
                    const step =
                        result.events.SupplyChainStep.returnValues._step;
                    const address =
                        result.events.SupplyChainStep.returnValues._itemAddress;

                    this.props.handleCreateProductApi({
                        name: productName,
                        price: +productPrice,
                        thumbnail: media,
                        creator: this.props.currentUserId,
                        addressCreator: this.accounts[0],
                        addressProduct: address,
                        status: step,
                        indexProduct: +itemIndex,
                    });

                    this.handleHiddenFormEdit();
                } catch (err) {
                    alert(err.message);
                    this.handleHiddenFormEdit();
                }
            }
        } else {
            toast.warning('Chưa kết nối với ví');
        }
        this.props.handleGetProductApi(this.props.user.wallet);
        setTimeout(() => {
            this.props.toggleLoadingFalse();
        }, 500);
    };

    handCLickDelivered = async (item) => {
        this.props.toggleLoadingTrue();
        try {
            await this.itemManager.methods
                .triggerDelivery(item.indexProduct)
                .send({ from: this.accounts[0] });

            this.props.handleUpdateStatusProductApi({
                ...item,
                status: 2,
            });
        } catch (e) {
            console.log(e);
            alert('Delivered failed ');
        }
        setTimeout(() => {
            this.props.toggleLoadingFalse();
        }, 500);
    };

    handleRemoveItem = async (item) => {
        this.props.toggleLoadingTrue();
        try {
            await this.itemManager.methods.removeItem(item.indexProduct).call();
            this.props.handleDeleteProduct(item);
        } catch (e) {
            alert('Delete failed ');
        }
        setTimeout(() => {
            this.props.toggleLoadingFalse();
        }, 500);
    };

    //============================
    handleEditItem = async (item) => {
        this.setState({
            isFormEditItem: true,
            isEdit: true,
            image: item.thumbnail,
            productName: item.name,
            productPrice: item.price,
            productEdit: item,
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
            productEdit: null,
        });
    };

    handleShowFormCreateItem = () => {
        this.setState({
            isFormEditItem: !this.state.isFormEditItem,
        });
    };

    componentDidMount = async () => {
        this.props.handleGetProductApi(this.props.user.wallet);
        if (this.props.web3) {
            this.accounts = await this.props.web3.eth.getAccounts();
            this.networkId = await this.props.web3.eth.net.getId();
            this.itemManager = new this.props.web3.eth.Contract(
                ItemManagerContract.abi,
                ItemManagerContract.networks[this.networkId] &&
                    ItemManagerContract.networks[this.networkId].address,
            );
        }
    };

    componentDidUpdate = async (nextProps) => {
        if (nextProps.web3 !== this.props.web3) {
            if (this.props.web3) {
                try {
                    this.web3 = this.props.web3;

                    this.accounts = await this.web3.eth.getAccounts();

                    this.networkId = await this.web3.eth.net.getId();

                    this.itemManager = new this.web3.eth.Contract(
                        ItemManagerContract.abi,
                        ItemManagerContract.networks[this.networkId] &&
                            ItemManagerContract.networks[this.networkId]
                                .address,
                    );
                } catch (error) {
                    alert(
                        `Failed to load web3, accounts, or contract. Check console for details.`,
                    );
                    console.error(error);
                }
            }
        }

        !this.props.products &&
            setTimeout(() => {
                this.props.toggleLoadingFalse();
            }, 500);
    };

    handleShowItemUser = () => {
        // const { listItems } = this.state;
        // if (listItems.length) {
        //     if (this.accounts[0]) {
        //         const newListItemUser = listItems.filter((item) => {
        //             return item.ownerAddress === this.accounts[0];
        //         });
        //         this.setState({
        //             listItems: newListItemUser,
        //         });
        //     } else {
        //         toast.warning('Not connected to wallet!');
        //     }
        // } else {
        //     toast.warning('List item is empty!');
        // }
    };

    render() {
        return (
            <div>
                <div id="create">
                    <div id="container">
                        <button
                            type="button"
                            onClick={this.handleShowFormCreateItem}
                            className="create-btn"
                        >
                            Create new Item
                        </button>
                    </div>
                </div>
                <TableProduct
                    handCLickDelivered={this.handCLickDelivered}
                    handleRemoveItem={this.handleRemoveItem}
                    handleEditItem={this.handleEditItem}
                    listItems={this.props.products ? this.props.products : []}
                />
                <FormEdit
                    handleHiddenFormEdit={this.handleHiddenFormEdit}
                    handleInputChange={this.handleInputChange}
                    productName={this.state.productName}
                    productPrice={this.state.productPrice}
                    handleSubmitFormEdit={this.handleSubmitFormEdit}
                    handleChangeImage={this.handleChangeImage}
                    image={this.state.image}
                    isFormEditItem={this.state.isFormEditItem}
                />
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoadingTrue: () => dispatch(setLoadingTrue()),
        toggleLoadingFalse: () => dispatch(setLoadingFalse()),
        handleCreateProductApi: (data) => dispatch(createProductApi(data)),
        handleGetProductApi: (wallet) => dispatch(getUserAllProductApi(wallet)),
        handleUpdateStatusProductApi: (data) =>
            dispatch(updateStatusProductApi(data)),
        handleDeleteProduct: (data) => dispatch(deleteProductApi(data)),
    };
};

export default connect(null, mapDispatchToProps)(Home);

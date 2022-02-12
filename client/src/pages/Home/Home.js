import React, { Component } from 'react';
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
import CardInfo from '../../components/CardInfo';
import ButtonStatus from '../../components/ButtonStatus';
import { getUsersApi } from '../../redux/reducers/userReducer';
import { handleGetOrderUserAll } from '../../redux/reducers/orderReducer';

class Home extends Component {
    state = {
        isFormEditItem: false,
        productName: '',
        productPrice: '',
        productEdit: null,
        isEdit: false,
        image: '',
        listItems: [],
        statusTable: 'Store',
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
        if (this.props.itemManager) {
            if (this.state.isEdit) {
                const { productName, productPrice, productEdit, image } =
                    this.state;
                let media = image;
                if (image.name) {
                    media = await imageUpload(image);
                }

                try {
                    await this.props.itemManager.methods
                        .updateItem(
                            productEdit.indexProduct,
                            productName,
                            media,
                            +productPrice,
                        )
                        .send({ from: this.props.account });
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

                    let result = await this.props.itemManager.methods
                        .createItem(
                            productName,
                            media,
                            +productPrice,
                            this.props.account,
                        )
                        .send({
                            from: this.props.account,
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
                        addressCreator: this.props.account,
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
        if (this.props.itemManager) {
            try {
                await this.props.itemManager.methods
                    .triggerDelivery(item.indexProduct)
                    .send({ from: this.props.account });

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
        }
    };

    handleRemoveItem = async (item) => {
        this.props.toggleLoadingTrue();
        if (this.props.itemManager) {
            try {
                await this.props.itemManager.methods
                    .removeItem(item.indexProduct)
                    .call();
                this.props.handleDeleteProduct(item);
            } catch (e) {
                alert('Delete failed ');
            }
            setTimeout(() => {
                this.props.toggleLoadingFalse();
            }, 500);
        }
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
        this.props.toggleLoadingTrue();
        this.props.handleGetUserApi();
        this.props.handleGetProductApi(this.props.user.wallet);
        this.props.handleGetOrderUserAllApi();
        setTimeout(() => {
            this.props.toggleLoadingFalse();
        }, 500);
        this.setState({ listItems: this.props.products });
    };

    componentDidUpdate = (nextProps) => {
        if (nextProps.products !== this.props.products) {
            this.setState({ listItems: this.props.products });
        }
        if (nextProps.users !== this.props.users) {
            this.setState({ listItems: this.props.users });
        }
    };

    handleShowItemUser = () => {};

    handleConvertTable = (statusBtn) => {
        switch (statusBtn) {
            case 'Order':
                this.setState({
                    listItems: this.props.orders,
                    statusTable: statusBtn,
                });

                break;
            case 'User':
                this.setState({
                    listItems: this.props.users,
                    statusTable: statusBtn,
                });
                break;
            case 'Store':
                this.setState({
                    listItems: this.props.products,
                    statusTable: statusBtn,
                });
                break;
            default:
                break;
        }
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
                <div className="card-info">
                    <CardInfo
                        icon="fas fa-shopping-bag"
                        data={
                            this.props.products ? this.props.products.length : 0
                        }
                        color="#3cb7d4"
                        title="Purchases"
                    />
                    <CardInfo
                        icon="fas fa-user"
                        data={this.props.users ? this.props.users.length : 0}
                        color="#eaa539"
                        title="User"
                    />
                </div>
                <div className="button-status-table">
                    <ButtonStatus
                        icon="fas fa-store"
                        handleConvertTable={this.handleConvertTable}
                    />
                </div>
                <TableProduct
                    statusTable={this.state.statusTable}
                    handCLickDelivered={this.handCLickDelivered}
                    handleRemoveItem={this.handleRemoveItem}
                    handleEditItem={this.handleEditItem}
                    listItems={this.state.listItems ? this.state.listItems : []}
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
        handleGetUserApi: () => dispatch(getUsersApi()),
        handleGetOrderUserAllApi: () => dispatch(handleGetOrderUserAll()),
    };
};

export default connect(null, mapDispatchToProps)(Home);

import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'timeago.js';

function TableProduct({
    listItems,
    handCLickDelivered,
    handleRemoveItem,
    handleEditItem,
    statusTable,
}) {
    function convertStep(step) {
        let str = '';
        switch (step) {
            case 1:
                str = 'Pained';
                break;
            case 2:
                str = 'Delivered';
                break;
            default:
                str = 'Create';
                break;
        }
        return str;
    }

    function renderButtonByStep(step, item) {
        console.log(step);
        switch (step) {
            default:
                return (
                    <span
                        aria-hidden="true"
                        onClick={() => handleEditItem(item)}
                    >
                        <i className="fal fa-edit"></i>
                    </span>
                );
        }
    }

    const handleRenderTableDashboard = () => {
        switch (statusTable) {
            case 'Order':
                return (
                    <tr>
                        <th>User Id</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>&nbsp;</th>
                    </tr>
                );
            case 'User':
                return (
                    <tr>
                        <th>&nbsp;</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>&nbsp;</th>
                    </tr>
                );
            case 'Store':
                return (
                    <tr>
                        <th>&nbsp;</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>&nbsp;</th>
                    </tr>
                );
            default:
                break;
        }
    };

    const convertStepOrder = (step) => {
        let str = '';
        switch (step) {
            case 0:
                str = 'Chờ Xác Nhận';
                break;
            case 1:
                str = 'Đã Xác Nhận';
                break;
        }
        return str;
    };

    const renderButtonByStepOrder = (step, item) => {
        switch (step) {
            case 0:
                return (
                    <span
                        aria-hidden="true"
                        onClick={() => handCLickDelivered(item)}
                    >
                        <i className="fal fa-truck-container"></i>
                    </span>
                );
            case 1:
                return (
                    <span
                        aria-hidden="true"
                        onClick={() => handleRemoveItem(item)}
                    >
                        <i className="fal fa-trash-alt"></i>
                    </span>
                );
        }
    };

    const handleRenderTableDashboardBody = () => {
        console.log(statusTable);

        switch (statusTable) {
            case 'Order':
                return listItems.map((item) => (
                    <tr className="alert" role="alert" key={item._id}>
                        <td>
                            <div className="email">
                                <span>{item.userId}</span>
                            </div>
                        </td>
                        <td>{format(item.createdAt)}</td>
                        <td>
                            <p className={convertStep(item.orderStatus)}>
                                {convertStepOrder(item.orderStatus)}
                            </p>
                        </td>
                        <td>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                {renderButtonByStepOrder(item.status, item)}
                            </button>
                        </td>
                    </tr>
                ));
            case 'Store':
                return listItems.map((item) => (
                    <tr className="alert" role="alert" key={item._id}>
                        <td>
                            <div
                                className="img"
                                style={{
                                    backgroundImage: `url(${item.thumbnail})`,
                                }}
                            />
                        </td>
                        <td>
                            <div className="email">
                                <span>{item.name} </span>
                                <span>{item.addressProduct}</span>
                            </div>
                        </td>
                        <td>${item.price}</td>
                        <td className="quantity">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="quantity"
                                    className="quantity form-control input-number"
                                    value={1}
                                    min={1}
                                    max={100}
                                />
                            </div>
                        </td>
                        <td>
                            <p className={convertStep(item.status)}>
                                {convertStep(item.status)}
                            </p>
                        </td>
                        {!item.status && (
                            <td>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="alert"
                                    aria-label="Close"
                                >
                                    {renderButtonByStep(item.status, item)}
                                </button>
                            </td>
                        )}
                    </tr>
                ));
            case 'User':
                return listItems.map((user) => (
                    <tr className="alert" role="alert" key={user._id}>
                        <td>
                            <div
                                className="img"
                                style={{
                                    backgroundImage: `url(${
                                        user.profilePicture
                                            ? user.profilePicture
                                            : 'https://www.seaprodexhanoi.com.vn/img/no_avatar.jpg'
                                    })`,
                                }}
                            />
                        </td>
                        <td>
                            <div className="email">
                                <span>{user.username} </span>
                                <span>{user.wallet}</span>
                            </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <p className="Delivered">Đang hoạt động</p>
                        </td>
                    </tr>
                ));
        }
    };

    return (
        <section className="ftco-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-wrap">
                            <table className="table">
                                <thead className="thead-primary">
                                    {handleRenderTableDashboard()}
                                </thead>
                                <tbody>
                                    {handleRenderTableDashboardBody()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

TableProduct.propTypes = {};

export default TableProduct;

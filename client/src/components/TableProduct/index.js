import React from 'react';
import PropTypes from 'prop-types';

function TableProduct({
    listItems,
    handCLickDelivered,
    handleRemoveItem,
    handleEditItem,
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
        switch (step) {
            case 1:
                return (
                    <span
                        aria-hidden="true"
                        onClick={() => handCLickDelivered(item)}
                    >
                        <i className="fal fa-truck-container"></i>
                    </span>
                );
            case 2:
                return (
                    <span
                        aria-hidden="true"
                        onClick={() => handleRemoveItem(item)}
                    >
                        <i className="fal fa-trash-alt"></i>
                    </span>
                );
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
    return (
        <section className="ftco-section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 text-center mb-4">
                        <h2 className="heading-section">DashBoard</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="table-wrap">
                            <table className="table">
                                <thead className="thead-primary">
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listItems &&
                                        listItems.map((product) => (
                                            <tr
                                                className="alert"
                                                role="alert"
                                                key={product._id}
                                            >
                                                <td>
                                                    <div
                                                        className="img"
                                                        style={{
                                                            backgroundImage: `url(${product.thumbnail})`,
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="email">
                                                        <span>
                                                            {product.name}{' '}
                                                        </span>
                                                        <span>
                                                            {
                                                                product.addressProduct
                                                            }
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>${product.price}</td>
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
                                                    <p
                                                        className={convertStep(
                                                            product.status,
                                                        )}
                                                    >
                                                        {convertStep(
                                                            product.status,
                                                        )}
                                                    </p>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="close"
                                                        data-dismiss="alert"
                                                        aria-label="Close"
                                                    >
                                                        {renderButtonByStep(
                                                            product.status,
                                                            product,
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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

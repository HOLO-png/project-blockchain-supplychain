import React from 'react';

const CartItem = ({
    cartProducts,
    handleRemoveProductCart,
    handleChangeInputAmount,
}) => {
    return (
        <ul className="cartWrap">
            {cartProducts &&
                cartProducts.map((cartProduct) => (
                    <li className="items odd">
                        <div className="infoWrap">
                            <div className="cartSection">
                                <img
                                    src={cartProduct.product.thumbnail}
                                    alt=""
                                    className="itemImg"
                                />
                                <p className="itemNumber">
                                    {cartProduct.product.addressProduct}
                                </p>
                                <h3>{cartProduct.product.name}</h3>
                                <p>
                                    {' '}
                                    <input
                                        type="text"
                                        className="qty"
                                        placeholder={cartProduct.qty}
                                        onBlur={(e) =>
                                            handleChangeInputAmount(
                                                cartProduct,
                                                e.target.value,
                                            )
                                        }
                                    />{' '}
                                    x ${cartProduct.product.price}.00
                                </p>
                                <p className="stockStatus"> In Stock</p>
                            </div>
                            <div className="prodTotal cartSection">
                                <p>
                                    ${' '}
                                    {cartProduct.product.price *
                                        cartProduct.qty}
                                </p>
                            </div>
                            <div className="cartSection removeWrap">
                                <a
                                    className="remove"
                                    onClick={() =>
                                        handleRemoveProductCart(
                                            cartProduct.product,
                                        )
                                    }
                                >
                                    x
                                </a>
                            </div>
                        </div>
                    </li>
                ))}
        </ul>
    );
};

export default CartItem;

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    cartProductSelector,
    handleGetProductToCart,
} from '../../redux/reducers/productCartReducer';
import CartItem from './CartItem';
import {
    setLoadingFalse,
    setLoadingTrue,
} from '../../redux/reducers/loadingReducer';
import {
    handleRemoveProductToCart,
    handleResetCart,
    handleUpdateAmountProductToCart,
} from '../../redux/reducers/cartReducer';
import { toast } from 'react-toastify';
import { handleCreateOrderProduct } from '../../redux/reducers/orderReducer';
import { updateStatusProductOrder } from '../../redux/reducers/productReducer';

function Cart({ cart, user, cartManager, account }) {
    const dispatch = useDispatch();
    const cartProducts = useSelector(cartProductSelector);

    useEffect(() => {
        if (cart) {
            const cartId = cart._id;
            dispatch(handleGetProductToCart(cartId));
        }
    }, [dispatch, cart]);

    const handleRemoveProductCart = (product) => {
        dispatch(setLoadingTrue());
        dispatch(handleRemoveProductToCart({ cart, product }));
        setTimeout(() => {
            dispatch(setLoadingFalse());
        }, 500);
    };

    const handleChangeInputAmount = (cartProduct, amount) => {
        if (cartProduct.qty !== +amount) {
            dispatch(setLoadingTrue());
            dispatch(
                handleUpdateAmountProductToCart({
                    cart,
                    product: { ...cartProduct.product, amount },
                }),
            );
            setTimeout(() => {
                dispatch(setLoadingFalse());
            }, 500);
        }
    };

    const handlePayOrderToCart = async () => {
        dispatch(setLoadingTrue());
        try {
            const productsId = [];
            cart.cart.items.forEach((item) => {
                productsId.push(item.productId);
            });
            let result = await cartManager.methods
                .createOrder(cart.userId, cart.cart.totalPrice + 9, account)
                .send({
                    value: cart.cart.totalPrice + 9,
                    from: account,
                });

            const userId = result.events.OrderChainStep.returnValues._userId;
            const orderPrice =
                result.events.OrderChainStep.returnValues._orderPrice;
            const step = result.events.OrderChainStep.returnValues._step;
            const userAddress =
                result.events.OrderChainStep.returnValues._userAddress;

            dispatch(
                handleCreateOrderProduct({
                    userId,
                    orderPrice: +orderPrice,
                    orderStatus: +step,
                    userAddress,
                    productsId,
                }),
            );

            dispatch(handleResetCart(cart));
            dispatch(updateStatusProductOrder({ productsId, status: 1 }));

            toast.success('order success');
        } catch (e) {
            console.log(e);
            toast.error('order failed ');
        }
        dispatch(setLoadingFalse());
    };

    return (
        <div className="container-cart">
            <div className="wrap cf">
                <h1 className="projTitle">
                    Hello {user.username}
                    <span> -Less</span> Shopping Cart
                </h1>
                <div className="heading cf">
                    <h1>My Cart</h1>
                    <Link to="/" className="continue">
                        Continue Shopping
                    </Link>
                </div>
                <div className="cart">
                    <ul class="tableHead">
                        <li class="prodHeader">Product</li>
                        <li>Quantity</li>
                        <li>Total</li>
                        <li>Remove</li>
                    </ul>
                    <CartItem
                        cartProducts={cartProducts}
                        handleRemoveProductCart={handleRemoveProductCart}
                        handleChangeInputAmount={handleChangeInputAmount}
                    />
                </div>
                <div className="promoCode">
                    <label htmlFor="promo">Have A Promo Code?</label>
                    <input type="text" name="promo" placeholder="Enter Code" />
                    <a href="#" className="btn" />
                </div>
                {cartProducts && cartProducts.length && (
                    <div className="subtotal cf">
                        <ul>
                            <li className="totalRow">
                                <span className="label">Subtotal</span>
                                <span className="value">
                                    ${cart && cart.cart.totalPrice}.00
                                </span>
                            </li>
                            <li className="totalRow">
                                <span className="label">Shipping</span>
                                <span className="value">$5.00</span>
                            </li>
                            <li className="totalRow">
                                <span className="label">Tax</span>
                                <span className="value">$4.00</span>
                            </li>
                            <li className="totalRow final">
                                <span className="label">Total</span>
                                <span className="value">
                                    ${cart && cart.cart.totalPrice + 9}.00
                                </span>
                            </li>
                            <li className="totalRow">
                                <a
                                    className="btn continue"
                                    onClick={handlePayOrderToCart}
                                >
                                    Checkout
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

Cart.propTypes = {};

export default Cart;

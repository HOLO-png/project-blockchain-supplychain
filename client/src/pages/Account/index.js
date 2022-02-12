import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setLoadingFalse,
    setLoadingTrue,
} from '../../redux/reducers/loadingReducer';
import {
    handleGetOrderUser,
    orderSelector,
} from '../../redux/reducers/orderReducer';
import OrderItem from './OrderItem';
import './styles.css';

export default function Account(userId) {
    const dispatch = useDispatch();
    const [isShowPopup, setIsShowPopup] = useState(false);
    const [products, setProducts] = useState(null);
    const orders = useSelector(orderSelector);
    const detailRef = useRef(null);

    useEffect(() => {
        if (userId) {
            dispatch(handleGetOrderUser(userId));
        }
    }, [dispatch]);

    const handleShowPopup = async (productsId) => {
        dispatch(setLoadingTrue());
        const res = await axios.get('/products/products-order', { productsId });
        setProducts(res.data);
        setIsShowPopup(!isShowPopup);
        dispatch(setLoadingFalse());
    };

    useEffect(() => {
        window.addEventListener('click', (e) => {
            if (
                !e.target.closest('#orderId') &&
                !e.target.closest('#btn-learn-more')
            ) {
                setIsShowPopup(false);
            }
        });
        return () => {
            window.removeEventListener('click', null);
        };
    }, []);

    console.log(products);

    const handleShowTableProduct = () => {
        if (products) {
            return products.map((product) => (
                <div className="popup_product_item__content" key={product._id}>
                    <div className="popup_product_item__content-image">
                        <img
                            src={product.thumbnail}
                            className=""
                            alt={product.name}
                        />
                    </div>
                    <div className="popup_product_item__content-name">
                        {product.name}
                    </div>
                    <div className="popup_product_item__content-price">
                        {product.price}
                    </div>
                </div>
            ));
        }
    };
    return (
        <div className="price_table">
            {orders &&
                orders.map((order) => (
                    <OrderItem
                        order={order}
                        handleShowPopup={handleShowPopup}
                    />
                ))}

            {/* <div className="package package_bronze">
                <div className="banner">Đang giao hàng</div>
                <h2>Delivery</h2>
                <div className="price">
                    $<div className="big">100</div>
                </div>
                <p>Đơn hàng của bạn đã được duyệt (10/12/2022)</p>
                <button>Learn more</button>
            </div> */}
            <div
                className="popup_product_item"
                style={{
                    opacity: isShowPopup ? '1' : '0',
                    visibility: isShowPopup ? 'visible' : 'hidden',
                    transition: '0.5s',
                }}
                id="orderId"
                ref={detailRef}
            >
                <div className="popup_product_item__list-item">
                    {handleShowTableProduct()}
                </div>
            </div>
        </div>
    );
}

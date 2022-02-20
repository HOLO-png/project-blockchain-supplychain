import React from 'react';
import { format } from 'timeago.js';

export default function OrderItem({ order, handleShowPopup }) {
    return (
        <div className="package package_free">
            <h2>
                {order.orderStatus
                    ? 'Đang giao đơn hàng'
                    : 'Đang xử lý đơn hàng'}
            </h2>
            <div className="price">
                wei<div className="big">{order.orderPrice}</div>
            </div>
            <p>
                {order.orderStatus
                    ? 'Đơn hàng của bạn đã được duyệt'
                    : 'Đơn hàng của bạn đang chờ xử lý'}{' '}
                ( {format(order.createdAt)} )
            </p>
            <button
                onClick={() => handleShowPopup(order.productsId)}
                id="btn-learn-more"
            >
                Learn more
            </button>
        </div>
    );
}

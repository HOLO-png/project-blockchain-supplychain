import React from 'react';
import './itemStyle.css';

export default function ListItem(props) {
    return (
        <div className="card">
            <div className="card-header">
                <img src={props.item.thumbnail} alt="rover" />
            </div>
            <div className="card-body">
                <span className="tag tag-teal">Stocking</span>
                <h4 className="product-name">{props.item.name}</h4>
                <p className="product-address">{props.item.addressProduct}</p>
                <p className="product-price">{props.item.price}</p>
                <div className="btn-action">
                    {!props.user.isAdmin && (
                        <>
                            <button
                                onClick={() => props.handCLickPaid(props.item)}
                                className="item-paid--btn"
                            >
                                Buy
                            </button>
                            <button
                                onClick={() =>
                                    props.handleAddToCart(props.item)
                                }
                                className="item-delivery--btn"
                            >
                                Add To Cart
                            </button>
                        </>
                    )}
                </div>
                <div className="user">
                    <img
                        src="https://yt3.ggpht.com/a/AGF-l7-0J1G0Ue0mcZMw-99kMeVuBmRxiPjyvIYONg=s900-c-k-c0xffffffff-no-rj-mo"
                        alt="user"
                    />
                    <div className="user-info">
                        <h5 className="user-address">
                            {props.item.addressCreator}
                        </h5>
                        <small>2h ago</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

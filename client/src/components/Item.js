import React from 'react';
import './itemStyle.css';

export default function ListItem(props) {
    function convertStep(step) {
        let str = '';
        switch (step) {
            case '1':
                str = 'Pained';
                break;
            case '2':
                str = 'Delivered';
                break;
            default:
                str = 'Create';
                break;
        }
        return str;
    }
    console.log(props.item.image);

    return (
        <div className="card">
            <div className="card-header">
                <img src={props.item.image} alt="rover" />
            </div>
            <div className="card-body">
                <span className="tag tag-teal">
                    {convertStep(props.item.step)}
                </span>
                <h4 className="product-name">{props.item.identifier}</h4>
                <p className="product-address">{props.item.addressItem}</p>
                <p className="product-price">{props.item.price}</p>
                <div className="btn-action">
                    {props.item.step == '0' ? (
                        <button
                            onClick={() => props.handCLickPaid(props.item)}
                            className="item-paid--btn"
                        >
                            Paid
                        </button>
                    ) : props.item.step == '1' ? (
                        <button
                            onClick={() => props.handCLickDelivered(props.item)}
                            className="item-delivery--btn"
                        >
                            Deliver
                        </button>
                    ) : props.item.step == '2' ? (
                        <button
                            onClick={() => props.handleRemoveItem(props.item)}
                            className="item-delete--btn"
                        >
                            Delete
                        </button>
                    ) : (
                        ''
                    )}
                    {props.item.step == '0' && (
                        <button
                            onClick={() => props.handleEditItem(props.item)}
                            className="item-edit--btn"
                        >
                            Edit
                        </button>
                    )}
                </div>
                <div className="user">
                    <img
                        src="https://yt3.ggpht.com/a/AGF-l7-0J1G0Ue0mcZMw-99kMeVuBmRxiPjyvIYONg=s900-c-k-c0xffffffff-no-rj-mo"
                        alt="user"
                    />
                    <div className="user-info">
                        <h5 className="user-address">
                            {props.item.ownerAddress}
                        </h5>
                        <small>2h ago</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

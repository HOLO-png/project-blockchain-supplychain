import Item from './Item';
import React, { Component, useState, useEffect } from 'react';

export default function ListItem(props) {
    return (
        <>
            <h1>Danh sách Item</h1>
            <div id="list" className="container">
                {props.listItems.map((item) => (
                    <Item
                        handCLickPaid={props.handCLickPaid}
                        item={item}
                        key={item.index}
                        handCLickDelivered={props.handCLickDelivered}
                        handleRemoveItem={props.handleRemoveItem}
                        handleEditItem={props.handleEditItem}
                    />
                ))}
            </div>
        </>
    );
}

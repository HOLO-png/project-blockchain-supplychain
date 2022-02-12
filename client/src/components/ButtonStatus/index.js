import React from 'react';
import './styles.css';

const btnStatus = [
    { title: 'Store', icon: 'fa-store' },
    { title: 'User', icon: 'fa-user' },
    { title: 'Order', icon: 'fa-dashboard' },
];

const ButtonStatus = ({ handleConvertTable }) => {
    return btnStatus.map((btn) => (
        <button
            className="button-status-table__item"
            onClick={() => handleConvertTable(btn.title)}
        >
            <i className={`fas ${btn.icon}`}></i>
        </button>
    ));
};

export default ButtonStatus;

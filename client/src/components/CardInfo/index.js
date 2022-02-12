import React from 'react';
import './styles.css';

const CardInfo = ({ icon, data, title, color }) => {
    return (
        <div className="card-info__item" style={{ background: color }}>
            <div className="card-info__content">
                <div className="card-info__content-left">
                    <div className="card-info__amount">{data}</div>
                    <div className="card-info__content-title">{title}</div>
                </div>
                <div
                    className="card-info__content-right"
                    style={{ color: color }}
                >
                    <i className={`fas ${icon}`}></i>
                </div>
            </div>
            <div className="card-info__status">
                <i className="fas fa-long-arrow-up"></i>
                <p className="card-info__status-value">3%</p>
            </div>
        </div>
    );
};

export default CardInfo;

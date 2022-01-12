import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './styles.css';
import { fetchActivationEmail } from '../../redux/reducers/authReducer';

function ActivationEmail() {
    const dispatch = useDispatch();
    const { activation_token } = useParams();

    useEffect(() => {
        if (activation_token) {
            dispatch(fetchActivationEmail(activation_token));
        }
    }, [activation_token, dispatch]);

    return (
        <div className="active_page">
            <aside>
                <img
                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4424790/Mirror.png"
                    alt="404 Image"
                />
            </aside>
            <main>
                <h1>Sorry!</h1>
                <p>
                    Xác nhận email đã hết hạn <em>. . . vui lòng thử lại.</em>
                </p>
            </main>
        </div>
    );
}

ActivationEmail.propTypes = {};

export default ActivationEmail;

import React, { Component, useEffect, useState } from 'react';
import './styles.css';
// import { loginCall, registerCall, socialLogin } from '../../apiCalls';
// import ScaleLoader from 'react-spinners/ScaleLoader';
import { toast } from 'react-toastify';
import Signup from '../../components/Signup';
import Signin from '../../components/Sigin';
import { override } from '../../utils/loadingStyle.js';
import { Route, Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    authSelector,
    fetchSigninAction,
    fetchSignupAction,
} from '../../redux/reducers/authReducer';
import { setWeb3, web3Selector } from '../../redux/reducers/web3Reducer';
import getWeb3 from '../../getWeb3';

export default function Login({ addressUser }) {
    const { path } = useParams();
    const history = useHistory();
    const [isActive, setIsActive] = useState(path === 'sign-up');

    const dispatch = useDispatch();
    const auth = useSelector(authSelector);

    const isShowSignup = () => {
        setIsActive(!isActive);
    };

    const handleLoginSignup = (val) => {
        if (addressUser) {
            dispatch(fetchSignupAction({ ...val, wallet: addressUser }));
        } else {
            toast.error('Not connected to wallet');
        }
    };

    const handleLoginSignin = async (val) => {
        if (addressUser) {
            dispatch(fetchSigninAction({ ...val, wallet: addressUser }));
        } else {
            toast.error('Not connected to wallet');
        }
    };

    useEffect(() => {
        if (auth.user) {
            history.push('/');
        }
    }, [auth.user]);

    return (
        <>
            <div className="login">
                <div className="form">
                    <div
                        className={
                            isActive
                                ? 'container right-panel-active'
                                : 'container'
                        }
                    >
                        <Route path="/login/sign-up">
                            <Signup onSubmit={handleLoginSignup} />
                        </Route>
                        <Route path="/login/sign-in">
                            <Signin onSubmit={handleLoginSignin} />
                        </Route>

                        <div className="form__overlay-container">
                            <div className="form__overlay">
                                <div className="form__overlay-panel form__overlay-left">
                                    <h1>Welcome Back!</h1>
                                    <p>
                                        To keep connected with us please login
                                        with your personal info
                                    </p>
                                    <Link
                                        onClick={isShowSignup}
                                        to="/login/sign-in"
                                        className="form__btn__ghost"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                                <div className="form__overlay-panel form__overlay-right">
                                    <h1>Hello, Friend!</h1>
                                    <p>
                                        Enter your personal details and start
                                        journey with us
                                    </p>
                                    <Link
                                        className="form__btn__ghost"
                                        onClick={isShowSignup}
                                        to="/login/sign-up"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="form__footer">
                        <p>
                            Shop điện tử Iphone <i className="fa fa-heart" />{' '}
                            của
                            <a type="link"> Hoàng Long</a> - Xin chân thành cảm
                            ơn quý khách đã ghé qua ạ
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}

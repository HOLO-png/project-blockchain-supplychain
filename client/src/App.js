import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Dashboard from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import { ToastContainer } from 'react-toastify';
import ActivationEmail from './pages/ActivationEmail/index.js';
import {
    authSelector,
    getTokenCall,
    getUserByToken,
} from './redux/reducers/authReducer.js';
import { useDispatch, useSelector } from 'react-redux';
import NotFound from './components/NotFound/NotFound.js';
import { override } from './utils/loadingStyle.js';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { loadingSelector } from './redux/reducers/loadingReducer.js';
import { setWeb3, web3Selector } from './redux/reducers/web3Reducer.js';
import getWeb3 from './getWeb3.js';
import {
    productSelector,
    updateProductApi,
} from './redux/reducers/productReducer.js';
import Header from './components/Header/index.js';
import UserContract from './contracts/User.json';
import Home from './pages/Dashboard/index.js';

// import Header from './components/header/Header'
// import StatusModal from './components/StatusModal'

function App() {
    const auth = useSelector(authSelector);
    const loading = useSelector(loadingSelector);
    const [addressUser, setAddressUser] = useState('');

    const dispatch = useDispatch();
    const user = localStorage.getItem('user');
    const web3 = useSelector(web3Selector);
    const products = useSelector(productSelector);

    // useEffect(() => {
    //     if (auth.user) {
    //         if (web3) {
    //             if (addressUser) {
    //                 handleLoginToContract(web3, auth.user._id, addressUser);
    //             }
    //         }
    //     }
    // }, [web3, auth.user, addressUser]);

    const handleLoginToContract = async (web3, userId, addressUser) => {
        const networkId = await web3.eth.net.getId();
        const user_contract = await new web3.eth.Contract(
            UserContract.abi,
            UserContract.networks[networkId] &&
                UserContract.networks[networkId].address,
        );

        user_contract &&
            user_contract.methods.Login(userId).send({ from: addressUser });
    };

    useEffect(() => {
        if (!web3) {
            getWeb3()
                .then((res) => dispatch(setWeb3(res)))
                .catch((err) => console.log(err));
        }
    }, [web3, dispatch]);

    useEffect(() => {
        if (web3) {
            web3.eth
                .getAccounts()
                .then((res) => setAddressUser(res[0]))
                .catch((err) => console.log(err));
        }
    }, [web3]);

    useEffect(() => {
        if (user) {
            dispatch(getTokenCall());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (auth.tokenAuth) {
            dispatch(getUserByToken(auth.tokenAuth));
        }
    }, [dispatch, auth.tokenAuth]);

    const handleUpdateProductApi = (data) => {
        if (data && auth.tokenAuth) {
            dispatch(updateProductApi({ data, token: auth.tokenAuth }));
        }
    };

    return (
        <>
            <Router>
                <ToastContainer />
                <div className="App">
                    <div className="main">
                        {loading && (
                            <div className="loading__container">
                                <ScaleLoader
                                    color={'#2963B3'}
                                    loading={loading}
                                    css={override}
                                    size={200}
                                />
                            </div>
                        )}
                        {auth.tokenAuth && auth.user ? (
                            <Header user={auth.user} />
                        ) : (
                            ''
                        )}

                        <Route exact path="/">
                            {auth.user && auth.tokenAuth ? (
                                <Home
                                    web3={web3}
                                    products={products}
                                    user={auth.user}
                                />
                            ) : (
                                <Redirect exact from="/" to="/login/:path" />
                            )}
                        </Route>
                        <Route exact path="/login/:path">
                            <Login addressUser={addressUser} />
                        </Route>
                        <Route path="/activate/:activation_token">
                            <ActivationEmail />
                        </Route>
                        <Route path="/dashboard">
                            {auth.user && auth.tokenAuth ? (
                                <Dashboard
                                    user={auth.user}
                                    products={products}
                                    web3={web3}
                                    currentUserId={auth.user._id}
                                    products={products}
                                    handleUpdateProductApi={
                                        handleUpdateProductApi
                                    }
                                />
                            ) : (
                                <Redirect exact from="/" to="/login/:path" />
                            )}
                        </Route>
                        <Route exact path="*">
                            {auth.user && auth.tokenAuth ? (
                                <NotFound />
                            ) : (
                                <Redirect exact from="/" to="/login/sign-in" />
                            )}
                        </Route>
                    </div>
                </div>
            </Router>
        </>
    );
}

export default App;

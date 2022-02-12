import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import ItemManagerContract from './contracts/ItemManager.json';
import CartManagerContract from './contracts/cartManager.json';

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
import Home from './pages/Dashboard/index.js';
import Cart from './pages/Cart/index.js';
import { userSelector } from './redux/reducers/userReducer';
import {
    cartSelector,
    getOrCreateCartToUserApi,
} from './redux/reducers/cartReducer';
import Account from './pages/Account';
import './App.css';
import { orderSelector } from './redux/reducers/orderReducer';

// import Header from './components/header/Header'
// import StatusModal from './components/StatusModal'

function App() {
    const auth = useSelector(authSelector);
    const users = useSelector(userSelector);
    const cart = useSelector(cartSelector);
    const orders = useSelector(orderSelector);

    const loading = useSelector(loadingSelector);
    const [account, setAccount] = useState('');

    const dispatch = useDispatch();
    const user = localStorage.getItem('user');
    const web3 = useSelector(web3Selector);
    const products = useSelector(productSelector);

    const [contracts, setContracts] = useState({
        itemManager: null,
        cartManager: null,
    });
    useEffect(() => {
        if (auth.tokenAuth) {
            dispatch(getOrCreateCartToUserApi(auth.tokenAuth));
        }
    }, [dispatch, auth.tokenAuth]);

    // useEffect(() => {
    //     if (auth.user) {
    //         if (web3) {
    //             if (addressUser) {
    //                 handleLoginToContract(web3, auth.user._id, addressUser);
    //             }
    //         }
    //     }
    // }, [web3, auth.user, addressUser]);

    // const handleLoginToContract = async (web3, userId, addressUser) => {
    //     const networkId = await web3.eth.net.getId();
    //     const user_contract = await new web3.eth.Contract(
    //         UserContract.abi,
    //         UserContract.networks[networkId] &&
    //             UserContract.networks[networkId].address,
    //     );

    //     user_contract &&
    //         user_contract.methods.Login(userId).send({ from: addressUser });
    // };

    useEffect(async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            setAccount(accounts[0]);
        }
    }, []);

    useEffect(() => {
        if (!web3) {
            getWeb3()
                .then((res) => dispatch(setWeb3(res)))
                .catch((err) => console.log(err));
        }
    }, [web3, dispatch]);

    // useEffect(() => {
    //     if (web3) {
    //         web3.eth
    //             .getAccounts()
    //             .then((res) => setAddressUser(res[0]))
    //             .catch((err) => console.log(err));
    //     }
    // }, [web3]);

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

    useEffect(() => {
        if (web3) {
            handleSetContractState();
        }
    }, [web3]);

    const handleSetContractState = async () => {
        const networkId = await web3.eth.net.getId();
        const itemManager = new web3.eth.Contract(
            ItemManagerContract.abi,
            ItemManagerContract.networks[networkId] &&
                ItemManagerContract.networks[networkId].address,
        );
        const cartManager = new web3.eth.Contract(
            CartManagerContract.abi,
            CartManagerContract.networks[networkId] &&
                CartManagerContract.networks[networkId].address,
        );
        setContracts({ itemManager, cartManager });
    };

    // useEffect(() => {
    //     if (web3) {
    //         handleGetEventRealTime();
    //     }
    // }, [web3]);

    // const handleGetEventRealTime = async () => {
    //     if (web3) {
    //         const networkId = await web3.eth.net.getId();
    //         const itemManager = new web3.eth.Contract(
    //             ItemManagerContract.abi,
    //             ItemManagerContract.networks[networkId] &&
    //                 ItemManagerContract.networks[networkId].address,
    //         );

    //         itemManager.events.SupplyChainStep(
    //             { filter: {}, fromBlock: 'latest' },
    //             function (error, event) {
    //                 if (error) {
    //                     console.log(error);
    //                 } else {
    //                     console.log(event);
    //                     const address = event.returnValues._itemAddress;
    //                     setTimeout(() => {
    //                         dispatch(getProductItemApi(address));
    //                     }, 1000);
    //                 }
    //             },
    //         );
    //     }
    // };

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
                                    cart={cart}
                                    account={account}
                                />
                            ) : (
                                <Redirect exact from="/" to="/login/sign-in" />
                            )}
                        </Route>
                        <Route exact path="/login/:path">
                            <Login addressUser={account} />
                        </Route>
                        <Route path="/activate/:activation_token">
                            <ActivationEmail />
                        </Route>
                        {auth.user.isAdmin && (
                            <Route path="/dashboard">
                                {auth.user && auth.tokenAuth ? (
                                    <Dashboard
                                        user={auth.user}
                                        products={products}
                                        web3={web3 ? web3 : null}
                                        currentUserId={auth.user._id}
                                        products={products}
                                        handleUpdateProductApi={
                                            handleUpdateProductApi
                                        }
                                        account={account}
                                        users={users}
                                        itemManager={
                                            contracts.itemManager &&
                                            contracts.itemManager
                                        }
                                        orders={orders}
                                    />
                                ) : (
                                    <Redirect
                                        exact
                                        from="/"
                                        to="/login/sign-in"
                                    />
                                )}
                            </Route>
                        )}
                        <Route path="/cart">
                            {auth.user && auth.tokenAuth ? (
                                <Cart
                                    cart={cart}
                                    user={auth.user}
                                    cartManager={
                                        contracts.cartManager &&
                                        contracts.cartManager
                                    }
                                    account={account}
                                />
                            ) : (
                                <Redirect exact from="/" to="/login/sign-in" />
                            )}
                        </Route>

                        <Route path="/account">
                            {auth.user && auth.tokenAuth ? (
                                <Account userId={auth.user._id} />
                            ) : (
                                <Redirect exact from="/" to="/login/sign-in" />
                            )}
                        </Route>

                        <Route path="*">
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

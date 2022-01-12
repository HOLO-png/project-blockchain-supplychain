import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { useDispatch } from 'react-redux';
import {
    getProductApi,
    getUserAllProductApi,
    updateStatusProductApi,
} from '../../redux/reducers/productReducer';
import { toast } from 'react-toastify';
import ListItem from '../../components/Item/ListItem';
import {
    setLoadingFalse,
    setLoadingTrue,
} from '../../redux/reducers/loadingReducer';
import ItemManagerContract from '../../contracts/ItemManager.json';

function Dashboard({ web3, user, products }) {
    const dispatch = useDispatch();
    const [web3Data, setWeb3Data] = useState({
        web3: null,
        account: null,
        itemManager: null,
    });

    useEffect(() => {
        if (user.wallet) {
            dispatch(getProductApi());
        } else {
            toast.warning('No wallet address');
        }
    }, [dispatch, user.wallet]);

    useEffect(() => {
        handleSetWeb3Update();
    }, [web3]);

    const handleSetWeb3Update = async () => {
        if (web3) {
            try {
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const itemManager = new web3.eth.Contract(
                    ItemManagerContract.abi,
                    ItemManagerContract.networks[networkId] &&
                        ItemManagerContract.networks[networkId].address,
                );
                setWeb3Data({
                    web3: web3,
                    accounts: accounts,
                    itemManager: itemManager,
                });
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        }
    };

    const handCLickPaid = async (item) => {
        dispatch(setLoadingTrue());
        try {
            await web3Data.itemManager.methods
                .triggerPayment(item.indexProduct)
                .send({
                    to: item.addressProduct,
                    value: item.price,
                    from: web3Data.accounts[0],
                    // gas: 600000,
                });
            dispatch(updateStatusProductApi({ ...item, status: 1 }));
        } catch (e) {
            console.log(e);
            alert('Pain failed ');
        }
        setTimeout(() => {
            dispatch(setLoadingFalse());
        }, 500);
    };

    return (
        <>
            <ListItem
                listItems={products ? products : []}
                handCLickPaid={handCLickPaid}
            />
        </>
    );
}

Dashboard.propTypes = {};

export default Dashboard;

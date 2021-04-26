import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Select from 'react-select';
import OrderTable from '../components/OrderTable';
import { StatusOptions } from '../components/StatusOptions';
import Loading from '../components/Loading';
import './OrderManagement.css';

function OrderManagement() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [orderRow, setOrderRow] = useState([]);

    useEffect(() => {
        const getToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: 'ordersist-backend',
                    scope: 'read:user_information',
                });
                setToken(accessToken);
            } catch (e) {
                console.log(e.message);
            }
        };
        getToken();
    }, []);

    useEffect(() => {
        if (token !== '') {
            console.log(token);
        }
    }, [token]);

    const getOrderByStatus = async (status) => {
        try {
            const res = await axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/order/${status}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setOrderRow(res.data);
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    const onSelectStatus = (selectedItem) => {
        if (selectedItem !== null) {
            getOrderByStatus(selectedItem.value);
        }
    };

    return (isAuthenticated && (
        <div>
            <br></br>
            <h1 className='header'>Order Management</h1>
            <br></br>
            <div className='component-container'>
                <div className='selector'>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        options={StatusOptions}
                        placeholder="Select Status"
                        isMulti={false}
                        onChange={onSelectStatus}
                    />
                </div>
            </div>
            <br></br>
            <div className='component-container'>
                <OrderTable rows={orderRow} />
            </div>
            <br></br>
            <br></br>
        </div>
    ));
};

export default withAuthenticationRequired(OrderManagement, {
    onRedirecting: () => <Loading page='order' />
});
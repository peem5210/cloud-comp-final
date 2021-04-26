import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Select from 'react-select';
import OrderTable from '../components/OrderTable';
import { StatusOptions } from '../components/StatusOptions';
import Loading from '../components/Loading';
import logo from '../assets/narrow_logo.png';
import './OrderManagement.css';

function OrderManagement() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [orderDetail, setOrderDetail] = useState('');
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

    const onSubmit = async e => {
        e.preventDefault()
        const payload = {
            'detail': orderDetail,
            'customer_name': customerName,
            'customer_address': customerAddress,
            'customer_phone_number': customerPhoneNumber,
        }
        console.log(payload);
        /*
        try {
            const res = await axios.patch(`http://${process.env.REACT_APP_BACKEND_URL}/company`, payload, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
        getStatus();
        */
    };

    return (isAuthenticated && (
        <>
            <div>
                <br></br>
                <h1 className='header'>Order Management</h1>
            </div>
            <div className="container mt-4">
                <div className='logo-container'>
                    <img style={{ width: '50%' }} src={logo} alt='' />
                </div>
                <br></br>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label>Customer Name</label>
                        <input type="text" className="form-control" onChange={e => setCustomerName(e.target.value)} placeholder="Enter customer name"></input>
                    </div>
                    <div className='form-group'>
                        <label>Customer Phone Number</label>
                        <input type="text" className="form-control" onChange={e => setCustomerPhoneNumber(e.target.value)} placeholder="Enter customer phone number"></input>
                    </div>
                    <div className='form-group'>
                        <label>Customer Address</label>
                        <input type="text" className="form-control" onChange={e => setCustomerAddress(e.target.value)} placeholder="Enter customer address"></input>
                    </div>
                    <div className='form-group'>
                        <label>Order Detail</label>
                        <input type="text" className="form-control" onChange={e => setOrderDetail(e.target.value)} placeholder="Enter order detail"></input>
                    </div>
                    <button type="submit" className="btn btn-primary" >
                        Create Order
                    </button>
                </form>
            </div>
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
        </>
    ));
};

export default withAuthenticationRequired(OrderManagement, {
    onRedirecting: () => <Loading page='order' />
});
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Message from '../components/Message';
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
    const [orderNumber, setOrderNumber] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [createMessage, setCreateMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
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

    const getOrderByStatus = async (status) => {
        try {
            if (status === 'ALL') {
                const res = await axios.get(`https://${process.env.REACT_APP_BACKEND_URL}/order`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                setOrderRow(res.data);
            } else {
                const res = await axios.get(`https://${process.env.REACT_APP_BACKEND_URL}/order/${status}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                setOrderRow(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onSelectStatus = (selectedItem) => {
        if (selectedItem !== null) {
            setCurrentStatus(selectedItem.value);
            getOrderByStatus(selectedItem.value);
        }
    };

    const onSelectOrderStatus = (selectedItem) => {
        if (selectedItem !== null) {
            setOrderStatus(selectedItem.value);
        }
    };

    const onSubmitCreateOrder = async e => {
        e.preventDefault()
        const payload = {
            'detail': orderDetail,
            'customer_name': customerName,
            'customer_address': customerAddress,
            'customer_phone_number': customerPhoneNumber,
        }
        try {
            const res = await axios.post(`https://${process.env.REACT_APP_BACKEND_URL}/order`, payload, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setCreateMessage(`Order created!`);
        } catch (err) {
            if (err.response.status === 500) {
                setCreateMessage('There was a problem with the server');
            } else {
                setCreateMessage(err.response.data.msg);
            }
        }
        getOrderByStatus(currentStatus);
    };

    const onSubmitUpdateStatus = async e => {
        e.preventDefault()
        const payload = {
            'order_number': orderNumber,
            'status': orderStatus,
        }
        try {
            const res = await axios.patch(`https://${process.env.REACT_APP_BACKEND_URL}/order`, payload, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setUpdateMessage(`Order ${orderNumber} updated!`);
        } catch (err) {
            if (err.response.status === 500) {
                setUpdateMessage('There was a problem with the server');
            } else {
                setUpdateMessage(err.response.data.msg);
            }
        }
        getOrderByStatus(currentStatus);
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
                <h1 className='sub-header'>Create Order</h1>
                {createMessage ? <Message msg={createMessage} /> : null}
                <form onSubmit={onSubmitCreateOrder}>
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
                <br></br>
                <h1 className='sub-header'>Update Order Status</h1>
                {updateMessage ? <Message msg={updateMessage} /> : null}
                <form onSubmit={onSubmitUpdateStatus}>
                    <div className='form-group'>
                        <label>Order Number</label>
                        <input type="text" className="form-control" onChange={e => setOrderNumber(e.target.value)} placeholder="Enter order number"></input>
                    </div>
                    <div className='form-selector'>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable={true}
                            isSearchable={true}
                            options={StatusOptions.slice(0,4)}
                            placeholder="Select Status"
                            isMulti={false}
                            onChange={onSelectOrderStatus}
                            maxMenuHeight={120}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" >
                        Update Order
                    </button>
                </form>
            </div>
            <br></br>
            <h1 className='sub-header'>View Order</h1>
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
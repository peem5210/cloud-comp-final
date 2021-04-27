import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { DataContext } from '../components/DataContext';
import FileUpload from '../components/FileUpload';
import ShippingTable from '../components/ShippingTable';
import OrderTable from '../components/OrderTable';
import Loading from '../components/Loading';
import Message from '../components/Message';
import './OrderShipping.css';

function OrderShipping() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [paidOrder, setPaidOrder] = useState([]);
    const [message, setMessage] = useState('');
    const data = useContext(DataContext);

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
            getPaidOrder();
        }
    }, [token]);

    const getPaidOrder = async () => {
        try {
            const res = await axios.get(`https://${process.env.REACT_APP_BACKEND_URL}/order/paid`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setPaidOrder(res.data);
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    const sendMessage = async () => {
        const words = data.parcelList.map(function({parcel_number, order_number}){
            return {parcel_number, order_number};
        });
        try {
            const res = await axios.post(`https://${process.env.REACT_APP_BACKEND_URL}/notification`, 
            {
                words: words,
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            if (res.data.failed.length > 0) {
                setMessage(`Send Message Fail with ${res.data.failed.length} Errors!`);
            } else {
                setMessage('Send Message Success!');
            }
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
        getPaidOrder();
    }

    return (isAuthenticated && (
        <div>
            <br></br>
            <h1 className='header'>Order Shipping</h1>
            <div className='container mt-4'>
                <FileUpload token={token} />
            </div>
            {data.uploadedFile ? (
                <div className='component-container'>
                    <div className='picture-container'>
                        <img style={{ width: '60%' }} src={data.s3Url} alt='' />
                    </div>
                </div>
            ) : null}
            <div>
                <h1 className='sub-header'>Fill Order Number</h1>
            </div>
            <div className='component-container'>
                <ShippingTable />
            </div>
            <br></br>
            <div className='component-container'>
                <button onClick={() => sendMessage()} className="btn btn-primary" >Send Message</button>
            </div>
            <br></br>
            <div className='message-container'>
                {message ? <Message msg={message} /> : null}
            </div>
            <div>
                <h1 className='sub-header'>View Order</h1>
            </div>
            <div className='component-container'>
                <OrderTable rows={paidOrder} />
            </div>
            <br></br>
        </div>
    ));
}

export default withAuthenticationRequired(OrderShipping, {
    onRedirecting: () => <Loading page='shipping' />
});
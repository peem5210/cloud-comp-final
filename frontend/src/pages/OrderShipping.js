import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import FileUpload from '../components/FileUpload';
import ShippingTable from '../components/ShippingTable';
import PaidTable from '../components/PaidTable';
import Loading from '../components/Loading';
import Message from '../components/Message';
import './OrderShipping.css';

function Ordershipping() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [paidOrder, setPaidOrder] = useState([]);
    const [message, setMessage] = useState('');

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
        const getPaidOrder = async () => {
            try {
                const res = await axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/order/paid`, {
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
        if (token !== '') {
            console.log(token);
            getPaidOrder();
        }
    }, [token]);

    return (
        <div>
            <br></br>
            <h1 className='header'>Order Shipping</h1>
            <div className='container mt-4'>
                <FileUpload token={token} />
            </div>
            <div className='component-container'>
                <ShippingTable />
            </div>
            <br></br>
            <div className='component-container'>
                <button onClick={() => console.log('clicked')} className="btn btn-primary" >Send Message</button>
            </div>
            <br></br>
            {message ? <Message msg={message} /> : null}
            <div className='component-container'>
                <PaidTable rows={paidOrder} />
            </div>
            <br></br>
        </div>
    )
}

export default withAuthenticationRequired(Ordershipping, {
    onRedirecting: () => <Loading page='home' />
});
import React, { useState, useEffect } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import FileUpload from '../components/FileUpload';
import ShippingTable from '../components/ShippingTable';
import Loading from '../components/Loading';
import './OrderShipping.css';

function Ordershipping() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');

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
        console.log(token);
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
                <button onClick={console.log('clicked')} className="btn btn-primary" >Send Message</button>
            </div>
            <br></br>
        </div>
    )
}

export default withAuthenticationRequired(Ordershipping, {
    onRedirecting: () => <Loading page='home' />
});
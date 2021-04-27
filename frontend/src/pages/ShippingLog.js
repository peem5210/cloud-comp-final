import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import './ShippingLog.css';

function ShippingLog() {
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
        if (token !== '') {
            console.log(token);
        }
    }, [token]);

    return (isAuthenticated && (
        <>
            <div>
                <br></br>
                <h1 className='header'>Shipping Log Observation</h1>
            </div>
        </>
    ));
};

export default withAuthenticationRequired(ShippingLog, {
    onRedirecting: () => <Loading page='shipping log' />
});
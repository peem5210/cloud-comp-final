import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import LogTable from '../components/LogTable';
import Loading from '../components/Loading';
import './ShippingLog.css';

function ShippingLog() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [logs, setLogs] = useState([]);

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
        const getShippingLog = async () => {
            try {
                const res = await axios.get(`http://${process.env.REACT_APP_BACKEND_URL}/shipping-log`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                setLogs(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        if (token !== '') {
            console.log(token);
            getShippingLog();
        }
    }, [token]);

    return (isAuthenticated && (
        <>
            <br></br>
            <h1 className='header'>Shipping Log Observation</h1>
            <br></br>
            <div className='component-container'>
                <LogTable rows={logs} />
            </div>
        </>
    ));
};

export default withAuthenticationRequired(ShippingLog, {
    onRedirecting: () => <Loading page='shipping log' />
});
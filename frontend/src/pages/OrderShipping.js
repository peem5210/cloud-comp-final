import React, { useState, useEffect } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import FileUpload from '../components/FileUpload';
import Loading from '../components/Loading';
import './ProfileManagement.css';

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
            <h1 className='header'>Order Shipping</h1>
            <div className='container mt-4'>
                <h4 className='display-4 text-center mb-4'>
                    <i className='fab fa-react' /> React File Upload
                </h4>
                <FileUpload token={token}/>
            </div>
        </div>
    )
}

export default withAuthenticationRequired(Ordershipping, {
    onRedirecting: () => <Loading page='home' />
});
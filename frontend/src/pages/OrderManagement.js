import React from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import './ProfileManagement.css';

function OrderManagement() {
    const { isAuthenticated } = useAuth0();

    return (
        <div>
            <h1 className='header'>Order Management</h1>
        </div>
    )
}

export default withAuthenticationRequired(OrderManagement, {
    onRedirecting: () => <Loading page='home' />
});
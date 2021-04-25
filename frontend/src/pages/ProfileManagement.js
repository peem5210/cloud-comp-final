import React from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import './ProfileManagement.css';

function ProfileManagement() {
    const { isAuthenticated } = useAuth0();

    return (
        <div>
            <h1 className='header'>Profile Management</h1>
        </div>
    )
}

export default withAuthenticationRequired(ProfileManagement, {
    onRedirecting: () => <Loading page='home' />
});
import React from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import './Home.css';

function Home() {
    const { isAuthenticated } = useAuth0();

    return (
        <div>
            <h1 className='header'>Welcome to SCG Chem Automated Fault Detection System!</h1>
        </div>
    )
}

export default withAuthenticationRequired(Home, {
    onRedirecting: () => <Loading page='home' />
});
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Home() {
    const { isAuthenticated } = useAuth0();

    return (
        <div>
            <h1 className='header'>Welcome to SCG Chem Automated Fault Detection System!</h1>
        </div>
    )
}

export default Home

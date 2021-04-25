import React, { useState, useEffect } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';
import './ProfileManagement.css';

function ProfileManagement() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [buttonName, setButtonName] = useState('Create Shop');
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState('');
    const [shopEmail, setShopEmail] = useState('');

    useEffect(() => {
        const getToken = async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: 'ordersist-backend',
                    scope: 'openid profile email',
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

    const onSubmit = e => {
        e.preventDefault()
        const payload = {
          shopName,
          shopAddress,
          shopPhoneNumber,
          shopEmail
        }
        console.log('submit value', payload)
    };

    return (
        <div className="col-12 col-md-6 offset-md-3">
            <br></br>
            <h1 className='header'>Profile Management</h1>
            <br></br>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>Shop Name</label>
                    <input type="text" className="form-control" onChange={e => setShopName(e.target.value)} placeholder="Enter name"></input>
                </div>
                <div className='form-group'>
                    <label>Shop Address</label>
                    <input type="text" className="form-control" onChange={e => setShopAddress(e.target.value)} placeholder="Enter address"></input>
                </div>
                <div className='form-group'>
                    <label>Shop Phone Number</label>
                    <input type="text" className="form-control" onChange={e => setShopPhoneNumber(e.target.value)} placeholder="Enter phone number"></input>
                </div>
                <div className='form-group'>
                    <label>Shop Email</label>
                    <input type="text" className="form-control" onChange={e => setShopEmail(e.target.value)} placeholder="Enter email"></input>
                </div>
                <button type="submit" className="btn btn-primary" >
                    {buttonName}
                </button>
            </form>
        </div>
    )
}

export default withAuthenticationRequired(ProfileManagement, {
    onRedirecting: () => <Loading page='home' />
});
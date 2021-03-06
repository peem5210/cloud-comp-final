import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Message from '../components/Message';
import Loading from '../components/Loading';
import logo from '../assets/narrow_logo.png';
import './ProfileManagement.css';

function ProfileManagement() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [token, setToken] = useState('');
    const [buttonName, setButtonName] = useState('Create Shop Profile');
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState('');
    const [shopEmail, setShopEmail] = useState('');
    const [shopNameError, setShopNameError] = useState('');
    const [shopAddressError, setShopAddressError] = useState('');
    const [shopPhoneNumberError, setShopPhoneNumberError] = useState('');
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
        if (token !== '') {
            getStatus();
        }
    }, [token]);

    const getStatus = async () => {
        try {
            const res = await axios.get(`https://${process.env.REACT_APP_BACKEND_URL}/avail-company-email`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*',
                },
            });
            setShopName(res.data.company_name)
            setShopAddress(res.data.company_address)
            setShopPhoneNumber(res.data.company_phone_number)
            setShopEmail(res.data.email)
            if (res.data.status) {
                setMessage('Please create shop before using Ordersist!')
            } else {
                setButtonName('Update Shop Profile');
                setMessage('Profile created. Welcome to Ordersist!')
            }
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        if (shopName === '') {
            setShopNameError('Please fill in your shop name.');
            isValid = false;
        }
        if (shopAddress === '') {
            setShopAddressError('Please fill in your shop address.');
            isValid = false;
        }
        if (shopPhoneNumber.length !== 10 || !/^[0-9]/.test(shopPhoneNumber)) {
            setShopPhoneNumberError('Please enter valid phone number.');
            isValid = false;
        }
        if (shopPhoneNumber === '') {
            setShopPhoneNumberError('Please fill in your shop phone number.');
            isValid = false;
        }
        return isValid;
    }

    const onSubmit = async e => {
        e.preventDefault()
        const isValid = validateForm();
        if (isValid) {
            setShopNameError('');
            setShopPhoneNumberError('');
            setShopAddressError('');
            const payload = {
                'company_name': shopName,
                'company_address': shopAddress,
                'company_phone_number': shopPhoneNumber,
                'company_email': shopEmail.anchor,
            }
            try {
                const res = await axios.patch(`https://${process.env.REACT_APP_BACKEND_URL}/company`, payload, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*',
                    },
                });
            } catch (err) {
                if (err.response.status === 500) {
                    setMessage('There was a problem with the server');
                } else {
                    setMessage(err.response.data.msg);
                }
            }
            getStatus();
        }
    };

    return (isAuthenticated && (
        <>
            <div>
                <br></br>
                <h1 className='header'>Profile Management</h1>
            </div>
            <div className="container mt-4">
                <div className='logo-container'>
                    <img style={{ width: '50%' }} src={logo} alt='' />
                </div>
                <br></br>
                {message ? <Message msg={message} /> : null}
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <label>Shop Name</label>
                        <input type="text" className="form-control" onChange={e => setShopName(e.target.value)} value={shopName} placeholder="Enter shop name"></input>
                        <div style={{ color: "red", fontSize: 16, paddingTop: 10 }}>{shopNameError}</div>
                    </div>
                    <div className='form-group'>
                        <label>Shop Phone Number</label>
                        <input type="text" className="form-control" onChange={e => setShopPhoneNumber(e.target.value)} value={shopPhoneNumber} placeholder="Enter shop phone number"></input>
                        <div style={{ color: "red", fontSize: 16, paddingTop: 10 }}>{shopPhoneNumberError}</div>
                    </div>
                    <div className='form-group'>
                        <label>Shop Address</label>
                        <input type="text" className="form-control" onChange={e => setShopAddress(e.target.value)} value={shopAddress} placeholder="Enter shop address"></input>
                        <div style={{ color: "red", fontSize: 16, paddingTop: 10 }}>{shopAddressError}</div>
                    </div>
                    <div className='form-group'>
                        <label>Shop Email</label>
                        <input type="text" className="form-control" value={shopEmail} disabled={true}></input>
                    </div>
                    <button type="submit" className="btn btn-primary" >
                        {buttonName}
                    </button>
                </form>
                <br></br>
                <br></br>
            </div>
        </>
    ));
};

export default withAuthenticationRequired(ProfileManagement, {
    onRedirecting: () => <Loading page='profile' />
});
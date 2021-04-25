import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Auth0ProviderWithHistory from './Auth0Provider.js';
import Sidebar from './components/Sidebar';
import ProfileManagement from './pages/ProfileManagement';
import OrderManagement from './pages/OrderManagement';
import OrderShipping from './pages/OrderShipping';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Auth0ProviderWithHistory>
          <Sidebar /> 
          <Switch>
            <Route path='/' exact component={ProfileManagement} />
            <Route path='/order' exact component={OrderManagement} />
            <Route path='/shipping' exact component={OrderShipping} />
          </Switch>
        </Auth0ProviderWithHistory>
      </Router>
    </>
  );
}

export default App;

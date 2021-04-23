import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Auth0ProviderWithHistory from './Auth0Provider.js';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Auth0ProviderWithHistory>
          <Sidebar /> 
          <Switch>
            <Route path='/' exact component={Home} />
          </Switch>
        </Auth0ProviderWithHistory>
      </Router>
    </>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotMyPass from './pages/ForgotMyPass';
import RegisterAddress from './pages/RegisterAddress';
import Home from './pages/Home';

function PrivateRoute({ component: Component, ...rest }) {
  const user = useSelector(state => state.auth.user);
  const render = (props) => {
    if (user) {
      return <Component {...props} />
    }
    return <Redirect to='/' />
  };
  return <Route {...rest} render={render} />;
}

function UnauthRoute({ component: Component, ...rest }) {
  const user = useSelector(state => state.auth.user);
  const render = (props) => {
    if (!user) {
      return <Component {...props} />
    }
    return <Redirect to='/home' />
  };
  return <Route {...rest} render={render} />;
}

export default function routes() {
  return (
    <BrowserRouter>
      <Switch>
        <UnauthRoute path="/" exact component={Login} />
        <UnauthRoute path="/forgotmypass" component={ForgotMyPass} />
        <UnauthRoute path="/register" exact component={Register} />
        <PrivateRoute path="/home" exact component={Home} />
        <PrivateRoute path="/home/profile" component={Profile} />
        <Route path="/register/address" component={RegisterAddress} />
      </Switch>
    </BrowserRouter>
  );
}
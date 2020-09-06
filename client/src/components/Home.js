import React from 'react';
import PropTypes from 'prop-types';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';
import LoginSignup from './LoginSignup';

export default class Home extends React.Component {
  state = {
    token: '',
    isSignedIn: false,
    selectedGroupId: '',
    admin: false
  }

  componentDidMount = () => {
    this.setAuthState();
  }

  loginUser = (data) => {
    console.log('logging in')
    fetch('/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then((response) => this.setAuthToken(response))
    .then(() => this.setAuthState())
    .catch((error) => { console.log("error", error)})
  }

  logoutUser = () => {
    fetch('/login/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then(() => this.removeAuthToken())
    .then(() => this.setAuthState())
    .catch((error) => this.removeAuthToken())
  }

  setAuthToken = (response) => {
    console.log('setAuthToken')
    const { token } = response;
    localStorage.setItem('busDashboard::token', token);
  }

  removeAuthToken = () => {
    localStorage.removeItem('busDashboard::token');
  }

  setAuthState = () => {
    console.log('setAuthState')
    const token = localStorage.getItem('busDashboard::token') || '';
    this.setState({
      token: token,
      isSignedIn: token.length > 0
    })
  }

  render() {
    return (
      <div>
        <LoginSignup
          isSignedIn={this.state.isSignedIn}
          logoutUser={this.logoutUser}
        >
        </LoginSignup>

        <hr />
        <Logout
          isSignedIn={this.state.isSignedIn}
          logoutUser={this.logoutUser}
        >
        </Logout>
      </div>
    )
  }
}

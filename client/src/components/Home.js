import React from 'react';
import LoginSignup from './LoginSignup';
import Header from './Header';
import Dashboard from './Dashboard';
import Navigation from './Navigation';

export default class Home extends React.Component {
  state = {
    auth: {
      token: ''
    },
    token: '',
    isSignedIn: false,
    selectedGroupId: '',
    admin: false // set to false for deploy
  }

  componentDidMount = () => {
    this.setAuthState();
  }

  loginUser = (data) => {
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
    const { token } = this.state.auth
    fetch('/login/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token: token })
    })
    .then(res => res.json())
    .then(() => this.removeAuthToken())
    .then(() => this.setAuthState())
    .catch((error) => this.removeAuthToken())
  }

  setAuthToken = (response) => {
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
      auth: {
        token: token
      },
      isSignedIn: token.length > 0
    })
  }

  handleGroupClick = (tabId) => {
    if (tabId === 'admin') {
      this.setState({
        admin: true,
        selectedGroupId: ''
      })
    } else {
      this.setState({
        admin: false,
        selectedGroupId: tabId
      })
    }
  }

  render() {
    return (
      <div>
        <Header
          isSignedIn={this.state.isSignedIn}
          logoutUser={this.logoutUser}
        >
        </Header>
        <Navigation
          isSignedIn={this.state.isSignedIn}
          signOut={this.logoutUser}
          handleGroupClick={this.handleGroupClick}
          admin={this.state.admin}
          selectedGroupId={this.state.selectedGroupId}>
        </Navigation>
        { this.state.isSignedIn
          ? <Dashboard
              admin={this.state.admin}
              selectedGroupId={this.state.selectedGroupId}
            >
            </Dashboard>
          : <LoginSignup
              isSignedIn={this.state.isSignedIn}
              loginUser={this.loginUser}
            >
            </LoginSignup>
        }
      </div>
    )
  }
}

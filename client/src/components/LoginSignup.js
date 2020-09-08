import React from 'react';
import PropTypes from 'prop-types';
import Signup from './Signup';
import Login from './Login';


export default class LoginSignup extends React.Component {
  render() {
    return (
      <div className="signin-container">
        <p>This is experimental software. Be sure to choose a password that you remember because it can't be reset at the present time.</p>
        { this.props.isSignedIn
          ? null
          : <Signup isSignedIn={this.props.isSignedIn}></Signup>
        }
        <Login
          isSignedIn={this.props.isSignedIn}
          loginUser={this.props.loginUser}
        >
        </Login>
      </div>
    )
  }
}

LoginSignup.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired
}

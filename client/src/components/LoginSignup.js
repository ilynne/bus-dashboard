import React from 'react';
import PropTypes from 'prop-types';
import Signup from './Signup';
import Login from './Login';


export default class LoginSignup extends React.Component {
  render() {
    return (
      <div>
        <Signup></Signup>
        <hr />
        or
        <hr />
        <Login
          isSignedIn={this.props.isSignedIn}
          loginUser={this.loginUser}
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

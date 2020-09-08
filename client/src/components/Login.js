import React from 'react';
import PropTypes from 'prop-types';

export default class Login extends React.Component {
  state = {
    email: '',
    password: ''
  }

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleFormSubmit = (e) => {
    console.log('login')
    e.preventDefault();
    this.props.loginUser(this.state);
  }

  render() {
    return (
      <div class="signin-form-container">
        <form
          className={'login-form'}
          onSubmit={this.handleFormSubmit}
          method={'post'}
        >
          <input
            type={'text'}
            id={'email'}
            name={'email'}
            required={true}
            onChange={this.handleInputChange}
            placeholder={'email'}
          >
          </input>
          <input
            type={'password'}
            id={'password'}
            name={'password'}
            required={true}
            onChange={this.handleInputChange}
          >
          </input>
          <input
              type={'submit'}
              value={'Login'}
            >
            </input>
        </form>
      </div>
    )
  }
}

Login.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired
}

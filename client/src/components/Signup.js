import React from 'react';
import PropTypes from 'prop-types';

export default class Signup extends React.Component {
  state = {
    email: '',
    password: '',
    message: 'message here'
  }

  handleInputChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.signupUser();
  }

  signupUser = () => {
    fetch('/login/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    })
    .then(res => { this.handleSignupResponse(res.status) })
    .catch((error) => { console.log("error", error)})
  }

  handleSignupResponse = (res) => {
    switch(res) {
      case 200:
        this.setMessage('Success! You can login now.');
        break;
      case 409:
        this.setMessage('A user with that email already exists.');
        break;
      default:
        this.setMessage('Something went wrong');
    }
  }

  setMessage = (message) => {
    this.setState({
      message: message
    })
  }

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
        <form
          className={'sign-up-form'}
          onSubmit={this.handleFormSubmit}
          method={'post'}
        >
          <input
            type={'text'}
            id={'email'}
            name={'email'}
            required={true}
            onChange={this.handleInputChange}
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
              value={'Signup'}
            >
            </input>
        </form>
      </div>
    )
  }
}

Signup.propTypes = {

}

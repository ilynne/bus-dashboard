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
    e.preventDefault();
    this.loginUser();
  }

  loginUser = () => {
    fetch('/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then((response) => this.setToken(response))
    .catch((error) => { console.log("error", error)})
  }

  setToken = (response) => {
    const { token } = response;
    localStorage.setItem('busDashboard::token', token);
  }

  render() {
    return (
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
    )
  }
}

Login.propTypes = {

}

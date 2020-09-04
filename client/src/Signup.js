import React from 'react';
import PropTypes from 'prop-types';

export default class Signup extends React.Component {
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
    this.signupUser();
  }

  signupUser = () => {
    fetch('/login/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then((response) => console.log(response))
    .catch((error) => { console.log("error", error)})
  }

  render() {
    return (
      <form
        className={'sign-in-form'}
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
    )
  }
}

Signup.propTypes = {

}

import React from 'react';
import PropTypes from 'prop-types';

export default class Signup extends React.Component {
  handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(e)
    this.signupUser('ilynne@gmail.com', 'password')
  }

  signupUser = async (email, password) => {
    const data = { email: email, password: password };
    console.log(data, JSON.stringify(data))
    await fetch('/login/signup/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
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
        >
        </input>
        <input
          type={'text'}
          id={'password'}
          name={'password'}
          required={true}
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

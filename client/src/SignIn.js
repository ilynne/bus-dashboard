import React from 'react';
import PropTypes from 'prop-types';

export default class SignIn extends React.Component {
  render() {
    return (
      <form
        className={'sign-in-form'}
        onSubmit={this.handleFormSubmit}
        method={'post'}
        action={'/login/signup'}
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
          >
          </input>
      </form>
    )
  }
}

SignIn.propTypes = {

}

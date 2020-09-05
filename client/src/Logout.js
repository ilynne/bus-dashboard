import React from 'react';
import PropTypes from 'prop-types';

export default class Logout extends React.Component {
  state = {
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
    fetch('/login/logout', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state)
    })
    .then(res => res.json())
    .then(() => this.removeToken())
    .catch((error) => this.removeToken())
  }

  removeToken = (response) => {
    localStorage.removeItem('busDashboard::token');
  }

  render() {
    return (
      <form
        className={'logout-form'}
        onSubmit={this.handleFormSubmit}
        method={'post'}
      >
        <input
            type={'submit'}
            value={'Logout'}
          >
          </input>
      </form>
    )
  }
}

Logout.propTypes = {

}

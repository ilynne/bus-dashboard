import React from 'react';
import PropTypes from 'prop-types';

export default class Logout extends React.Component {
  handleFormSubmit = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    return (
      <div className='display-user'>
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
      </div>
    )
  }
}

Logout.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired
}

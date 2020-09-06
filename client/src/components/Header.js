import React from 'react';
import PropTypes from 'prop-types';
import Logout from './Logout';

export default class Header extends React.Component {
  state = {
    groups: []
  }

  render() {
    return (
      <div className={"header"}>
        <div className={"title"}>Bus Arrivals</div>
        <div className={'banner'}>
          BLACK LIVES MATTER
        </div>
        { this.props.isSignedIn
          ? <Logout
              isSignedIn={this.props.isSignedIn}
              logoutUser={this.props.logoutUser}
            >
            </Logout>
          : <div
              className={'display-user'}
            >
              signed out
            </div>
        }
      </div>
    )
  }
}

Header.propTypes = {
  isSignedIn: PropTypes.bool.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

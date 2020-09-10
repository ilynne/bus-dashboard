import React from 'react';
import PropTypes from 'prop-types';

export default class TabList extends React.Component {

  handleGroupClick = (e) => {
    this.props.handleGroupClick(e.target.dataset.id)
  }

  render() {
    return (
      <div className="tabs">
        { this.props.groups.map((group) => (
          <div
            className={this.props.selectedGroupId === group._id ? 'selected' : null}
            onClick={this.handleGroupClick}
            key={group._id}
            data-id={group._id}>{group.name}</div>
          ))
        }
        <div
          className={this.props.admin ? 'selected' : null}
          onClick={this.handleGroupClick}
          key={'admin-tab'}
          data-id={'admin'}>Admin</div>
      </div>
    )
  }
}

TabList.propTypes = {
  admin: PropTypes.bool.isRequired,
  selectedGroupId: PropTypes.string.isRequired,
  handleGroupClick: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired
}

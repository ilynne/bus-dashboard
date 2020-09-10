import React from 'react';
import AddBus from './AddBus';
import Arrivals from './Arrivals';
import PropTypes from 'prop-types';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        { this.props.admin
          ? <AddBus
              groups={this.props.groups}
              selectedGroupId={this.props.selectedGroupId}
              getGroups={this.props.getGroups}
            >
            </AddBus>
          : null
        }
        { this.props.selectedGroupId !== ''
          ? <Arrivals
              selectedGroupId={this.props.selectedGroupId}
            >
            </Arrivals>
          : null
        }
      </div>
    )
  }
}

Dashboard.propTypes = {
  admin: PropTypes.bool.isRequired,
  selectedGroupId: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  getGroups: PropTypes.func.isRequired,
}

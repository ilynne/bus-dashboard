import React from 'react';
import PropTypes from 'prop-types';

export default class StopList extends React.Component {
  stopIdsForBusDirectionGroup = () => {
    console.log('filter', this.props.stopsForDirection, this.props.busRouteId, this.props.stopsForGroup)
    return this.props.stopsForGroup.filter(stop => { return stop.busId === this.props.busRouteId } ).map(stop => { return stop.stopId})
  }

  groupStopsRecordId = (stopId) => {
    const stopData = this.props.stopsForGroup.find(stop => { return stop.stopId === stopId })
    if (stopData) {
      return stopData._id
    } else {
      return null
    }
  }

  render() {
    const stopIds = this.stopIdsForBusDirectionGroup();

    return (
      <div>
        <p>Stops</p>
        <ul>
          { this.props.stopsForDirection.map((stop, i) => (
            <li
              className={stopIds.includes(stop.id) ? 'selected' : null}
              onClick={stopIds.includes(stop.id) ? this.props.removeStop : this.props.addStop}
              key={`stop-${i}`}
              data-id={stop.id}
              data-record-id={this.groupStopsRecordId(stop.id)}>{stop.name}</li>
            ))
          }
        </ul>
      </div>
    );
  }
}

StopList.propTypes = {
  busRouteId: PropTypes.string.isRequired,
  selectedGroupId: PropTypes.string.isRequired,
  stopsForGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  stopsForDirection: PropTypes.arrayOf(PropTypes.object).isRequired,
  addStop: PropTypes.func.isRequired,
  removeStop: PropTypes.func.isRequired,
}

import React from 'react';
import _ from 'lodash';
import GroupPreviewCard from './GroupPreviewCard';
import PropTypes from 'prop-types';

export default class GroupPreviewList extends React.PureComponent {
  groupStopsRecordId = (stopId) => {
    const stopData = this.props.stopsForGroup.find(stop => { return stop.stopId === stopId })
    if (stopData) {
      return stopData._id
    } else {
      return null
    }
  }

  busesByStop = () => {
    return _.groupBy(this.props.stopsForGroup, (stopsForGroup) => ( stopsForGroup.stopId ))
  }

  render() {
    const busesByStop = this.busesByStop();

    return (
      <div className="group-preview">
        { Object.keys(busesByStop).map((stopId) => (
          <GroupPreviewCard
            key={stopId}
            stopId={stopId}
            busRouteIds={busesByStop[stopId]}
            routesForAgency={this.props.routesForAgency}
            removeStop={this.props.removeStop}
            data-record-id={this.groupStopsRecordId(stopId)}
          >
          </GroupPreviewCard>
        ))}
      </div>
    )
  }
}

GroupPreviewList.propTypes = {
  routesForAgency: PropTypes.arrayOf(PropTypes.object).isRequired,
  stopsForGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeStop: PropTypes.func,
}

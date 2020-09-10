import React from 'react';
import _ from 'lodash';
import GroupPreviewCard from './GroupPreviewCard';
import PropTypes from 'prop-types';

export default class SearchPreviewList extends React.PureComponent {
  // groupStopsRecordId = (stopId) => {
  //   const stopData = this.props.stopsForGroup.find(stop => { return stop.stopId === stopId })
  //   if (stopData) {
  //     return stopData._id
  //   } else {
  //     return null
  //   }
  // }

  // busesByStop = () => {
  //   return _.groupBy(this.props.stopsForGroup, (stopsForGroup) => ( stopsForGroup.stopId ))
  // }

  render() {
    // const busesByStop = this.busesByStop();

    return (
      <div className="search-preview">
        {JSON.stringify(this.props.groups)}
      </div>
    )
  }
}

SearchPreviewList.propTypes = {
  routesForAgency: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeStop: PropTypes.func,
}

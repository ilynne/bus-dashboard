import React from 'react';
import _ from 'lodash';
import GroupPreviewCard from './GroupPreviewCard';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class GroupPreviewList extends React.PureComponent {
  // state = {
  //   stops: []
  // }

  // componentDidMount() {
  //   this.getStopsForGroup();
  // }

  // getStopsForGroup = () => {
  //   const token = localStorage.getItem('busDashboard::token');
  //   const { selectedGroupId } = this.props;
  //   const data = {
  //     groupId: selectedGroupId
  //   }
  //   axios.get('/stops', {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //     params: data
  //   })
  //     .then(res => {
  //       this.setState({ stops: res.data })
  //     })
  // }

  // removeStop = (e) => {
  //   const token = localStorage.getItem('busDashboard::token');
  //   const { recordId } = e.target.dataset
  //   axios.delete(`/stops/${recordId}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   })
  //     .then(() => { this.getStopsForGroup() })
  // }

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
  selectedGroupId: PropTypes.string.isRequired,
  routesForAgency: PropTypes.arrayOf(PropTypes.object).isRequired,
  stopsForGroup: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeStop: PropTypes.func.isRequired,
}

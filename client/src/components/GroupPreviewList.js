import React from 'react';
import _ from 'lodash';
import GroupPreviewCard from './GroupPreviewCard';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class GroupPreviewList extends React.PureComponent {
  state = {
    stops: []
  }

  componentDidMount() {
    this.getStopsForGroup();
  }

  getStopsForGroup = () => {
    const token = localStorage.getItem('busDashboard::token');
    const { selectedGroupId } = this.props;
    const data = {
      groupId: selectedGroupId
    }
    axios.get('/stops', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: data
    })
      .then(res => {
        this.setState({ stops: res.data })
      })
  }

  removeStop = (e) => {
    const token = localStorage.getItem('busDashboard::token');
    const { recordId } = e.target.dataset
    axios.delete(`/stops/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => { this.getStopsForGroup() })
  }

  busesByStop = () => {
    return _.groupBy(this.state.stops, (stop) => ( stop.stopId ))
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
            handleDeleteClick={this.removeStop}
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
  groupStops: PropTypes.arrayOf(PropTypes.object).isRequired,
}

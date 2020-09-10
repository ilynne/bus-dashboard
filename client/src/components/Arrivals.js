import React from 'react';
import _ from 'lodash';
import ArrivalCard from './ArrivalCard';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class Arrivals extends React.PureComponent {
  state = {
    stops: []
  }

  componentDidMount() {
    this.getStopsForGroup();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.selectedGroupId !== this.props.selectedGroupId) {
      this.getStopsForGroup();
    }
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

  busesByStop = () => {
    return _.groupBy(this.state.stops, (stop) => ( stop.stopId ))
  }

  render() {
    const busesByStop = this.busesByStop();
    return (
      <div className="arrivals">
        { this.state.stops.length > 0
          ? Object.keys(busesByStop).map((stopId, i) => (
              <ArrivalCard
                key={`${stopId}-${i}`}
                stopId={stopId}
                busRouteIds={busesByStop[stopId]}
              >
              </ArrivalCard>
            ))
          : <p>This group does not have any buses. Click the "Admin" link, choose the group from the list, and add some buses!</p>
        }

      </div>
    )
  }
}

Arrivals.propTypes = {
  selectedGroupId: PropTypes.string.isRequired,
}

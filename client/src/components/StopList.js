import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class StopList extends React.Component {
  state = {
    groupStops: []
  }

  handleStopClick = (e) => {
    this.addStop(e.target.dataset.id)
  }

  componentDidMount() {
    this.getStopsForGroup();
  }

  getStopsForGroup = () => {
    console.log('getStopsForGroup')
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
        console.log(res)
        this.setGroupStops(res.data)
      })
  }

  setGroupStops = (data) => {
    console.log('setGroupStops', data, this.props.busRouteId)
    const groupStopsForBus = data.filter(stop => { return stop.busId === this.props.busRouteId } )
    this.setState({
      groupStops: groupStopsForBus
    })
  }

  addStop = (e) => {
    console.log('addStop')
    const token = localStorage.getItem('busDashboard::token');
    const { id } = e.target.dataset
    const { selectedGroupId, busRouteId } = this.props;
    const data = {
      stopId: id,
      groupId: selectedGroupId,
      busId: busRouteId,
    }
    axios.post('/stops', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res)
      })
      .then(() => { this.getStopsForGroup() })
  }

  removeStop = (e) => {
    console.log('removeStop')
    const token = localStorage.getItem('busDashboard::token');
    const { recordId } = e.target.dataset
    axios.delete(`/stops/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res)
      })
      .then(() => { this.getStopsForGroup() })
  }

  groupStopsRecordId = (stopId) => {
    const stopData = this.state.groupStops.find(stop => { return stop.stopId === stopId })
    if (stopData) {
      return stopData._id
    } else {
      return null
    }
  }

  render() {
    const groupStops = this.state.groupStops.map(stop => ( stop.stopId ));

    return (
      <div>
        <p>Stops</p>
        <ul>
          { this.props.stopsForDirection.map((stop, i) => (
            <li
              className={groupStops.includes(stop.id) ? 'selected' : null}
              onClick={groupStops.includes(stop.id) ? this.removeStop : this.addStop}
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
  stopsForDirection: PropTypes.arrayOf(PropTypes.object).isRequired,
}

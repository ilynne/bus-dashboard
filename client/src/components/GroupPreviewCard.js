import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class GroupPreviewCard extends React.Component {
  state = {
    arrivalsForStop: [],
    groupStops: []
  }

  componentDidMount = () => {
    this.fetchArrivalsForStop();
  }

  fetchArrivalsForStop = function () {
    const { stopId } = this.props;

    // fetch(`/api/v1/stops/${stopId}/arrivals`)
    //   .then(res => res.json())
    //   .then((response) => { this.setArrivalsForStop(response.data) })
    //   .catch((error) => { console.log("Error while fetching test datas", error); })
    const token = localStorage.getItem('busDashboard::token')
    console.log(token)
    console.log(stopId)
    axios.get(`/oba/stops/${stopId}/arrivals`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        console.log(res.data);
        this.setArrivalsForStop(res.data)

      })
  }

  setArrivalsForStop = (data) => {
    this.setState({
      arrivalsForStop: data.data.data
    });
  }

  stopLabel = () => {
    const { references } = this.state.arrivalsForStop
    if (!references) {
      return `retrieving information for stop ${this.props.stopId}...`
    }
    const { stops } = references
    const stopData = stops.find(stop => stop.id === this.props.stopId);
    return `${stopData.name} - ${stopData.direction}`;
  }

  busRouteIds = () => {
    const busRouteIds = this.props.busRouteIds.map(busRouteId => ( busRouteId.busRouteId))
    return busRouteIds
  }

  busRouteShortName = (busRouteId) => {
    const { routesForAgency } = this.props;
    console.log('busRouteShortName, busRouteId', busRouteId, routesForAgency)
    if (!routesForAgency || routesForAgency.length < 1) {
      console.log('routesForAgency not populated')
      return
    }
    // const route = routesForAgency.find(routeForAgency => { return busRouteId === routeForAgency.id })
    const route = routesForAgency.find(routeForAgency => { return routeForAgency.id === busRouteId })
    // const route = routesForAgency[0];
    console.log(route)
    const shortName = route ? route.shortName : 'not found'
    return shortName
  }

  handleDeleteClick = (e) => {
    e.preventDefault();
    console.log('delete', e)
    this.props.handleDeleteClick(e)
  }

  render() {
    const stopLabel = this.stopLabel();

    return (
      <div className={'group-preview-card'}>
        <h2>{stopLabel}</h2>
        { this.props.busRouteIds.map(busRouteId => (
          <p key={busRouteId._id}>
            {this.busRouteShortName(busRouteId.busId)}
            &nbsp;
            <span
              className={'clickable delete-link'}
              data-id={busRouteId.stopId}
              onClick={this.handleDeleteClick}
              data-record-id={busRouteId._id}
            >
              &nbsp;
              delete
            </span>
          </p>
        ))}
      </div>
    )
  }
}

GroupPreviewCard.propTypes = {
  stopId: PropTypes.string.isRequired,
  busRouteIds: PropTypes.arrayOf(PropTypes.object).isRequired,
  routesForAgency: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
}

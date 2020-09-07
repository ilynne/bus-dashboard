import React from 'react';
import PropTypes from 'prop-types';

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

    fetch(`/api/v1/stops/${stopId}/arrivals`)
      .then(res => res.json())
      .then((response) => { this.setArrivalsForStop(response.data) })
      .catch((error) => { console.log("Error while fetching test datas", error); })
  }

  setArrivalsForStop = (data) => {
    this.setState({
      arrivalsForStop: data
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
    const busRouteIds = this.props.busRouteIds.map(busRouteId => ( busRouteId.data().busRouteId))
    return busRouteIds
  }

  busRouteShortName = (busRouteId) => {
    const { routesForAgency } = this.props;
    if (!routesForAgency) {
      return
    }
    const route = routesForAgency.find(route => busRouteId === route.id)
    const shortName = route ? route.shortName : 'not found'
    return shortName
  }

  handleDeleteClick = (e) => {
    this.props.handleDeleteClick(e.target.dataset.id)
  }

  render() {
    const stopLabel = this.stopLabel();

    return (
      <div className={'group-preview-card'}>
        <h2>{stopLabel}</h2>
        { this.props.busRouteIds.map(busRouteId => (
          <p key={busRouteId.id}>
            {this.busRouteShortName(busRouteId.data().busRouteId)}
            &nbsp;
            <span
              className={'clickable delete-link'}
              data-id={busRouteId.id}
              onClick={this.handleDeleteClick}
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

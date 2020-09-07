import React from 'react';
import DirectionList from './DirectionList';
import StopList from './StopList';
import GroupList from './GroupList';
import GroupPreviewList from './GroupPreviewList';
import BusInput from './BusInput';
import axios from 'axios';

export default class AddBus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      busNumber: '',
      busRouteId: '',
      routesForAgency: [],
      stopsByBusRouteId: {},
      directionIndex: -1,
      selectedGroupId: ''
    }
    this.handleBusNumberChange = this.handleBusNumberChange.bind(this);
    this.fetchRoutesForAgency = this.fetchRoutesForAgency.bind(this);
    this.fetchStopsForRoute = this.fetchStopsForRoute.bind(this);
    this.handleDirectionClick = this.handleDirectionClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
  }

  componentDidMount = () => {
    this.fetchRoutesForAgency();
  }

  fetchRoutesForAgency = function () {
    const token = localStorage.getItem('busDashboard::token')
    console.log(token)
    axios.get('/oba/routes/1', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        console.log(res, res.data);
        this.setRoutesForAgency(res.data)

      })
  }

  fetchStopsForRoute = () => {
    fetch(`/api/v1/routes/${this.state.busRouteId}/stops`)
      .then(res => res.json())
      .then((response) => { this.setStopsByBusRouteId(response.data); })
      .catch((error) => { console.log("Error fetching stops for route", error); });
  }

  setRoutesForAgency = (data) => {
    const { list } = data.data.data;
    console.log(list)
    this.setState({
      routesForAgency: list
    });
  }

  setStopsByBusRouteId = (data) => {
    const { busRouteId } = this.state;
    this.setState({
      stopsByBusRouteId: {
        [busRouteId]: data,
        ...this.state.stopsByBusRouteId
      }
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
  }

  handleBusNumberChange(busNumber) {
    this.setState({
      directionIndex: -1,
      busNumber: busNumber
    }, () => this.filterRoutesByShortName());
  }

  handleGroupClick(groupId) {
    this.setState({
      selectedGroupId: groupId,
      busNumber: '',
      busRouteId: '',
      directionIndex: -1
    });
  }

  handleDirectionClick(index) {
    this.setState({
      directionIndex: index
    });
  }

  stopsForDirection() {
    const stopGroups = this.stopGroups();
    const { directionIndex } = this.state;
    if (directionIndex >= 0) {
      const stopIds = stopGroups[directionIndex].stopIds;
      const { busRouteId, stopsByBusRouteId } = this.state;
      const { references } = stopsByBusRouteId[busRouteId] || [];
      return references.stops.filter(stop => stopIds.includes(stop.id));
    }
  }

  filterRoutesByShortName = () => {
    const routeForBusNumber = this.state.routesForAgency.find(route => route.shortName === this.state.busNumber);
    if (routeForBusNumber) {
      this.setState({
        busRouteId: routeForBusNumber.id
      }, () => { this.fetchStopsForRoute() });
    } else {
      this.setState({
        busRouteId: ""
      });
    }
  }

  stopGroups = () => {
    const { busRouteId, stopsByBusRouteId } = this.state;
    const { entry } = stopsByBusRouteId[busRouteId] || [];
    if (entry) {
      return entry.stopGroupings[0].stopGroups;
    }
  }

  render() {
    const stopGroups = this.stopGroups();
    const stopsForDirection = this.stopsForDirection();

    return (
      <div className={'admin'}>
        <form
          className={'add-bus-form'}
          onSubmit={this.handleFormSubmit}
          method={'post'}>
            <GroupList
              handleGroupClick={this.handleGroupClick}
              selectedGroupId={this.state.selectedGroupId}
            >
            </GroupList>

            { this.state.selectedGroupId !== ''
              ? <BusInput
                  busNumber={this.state.busNumber}
                  handleBusNumberChange={this.handleBusNumberChange}>
                </BusInput>
              : this.state.selectedGroupId
            }

            { stopGroups
              ? <DirectionList
                  stopGroups={stopGroups}
                  handleDirectionClick={this.handleDirectionClick}
                  directionIndex={this.state.directionIndex}
                >
                </DirectionList>
              : null
            }

            { stopsForDirection
              ? <StopList
                  busRouteId={this.state.busRouteId}
                  selectedGroupId={this.state.selectedGroupId}
                  stopsForDirection={stopsForDirection}
                >
                </StopList>
              : null
            }
        </form>
        { this.state.selectedGroupId !== ''
          ? <GroupPreviewList
              selectedGroupId={this.state.selectedGroupId}
              routesForAgency={this.state.routesForAgency}>
            </GroupPreviewList>
          : null
        }
      </div>
    )
  }
}

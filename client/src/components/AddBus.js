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
      selectedGroupId: '',
      groups: [],
      stopsForGroup: [],
    }
    this.handleBusNumberChange = this.handleBusNumberChange.bind(this);
    this.fetchRoutesForAgency = this.fetchRoutesForAgency.bind(this);
    this.fetchStopsForRoute = this.fetchStopsForRoute.bind(this);
    this.handleDirectionClick = this.handleDirectionClick.bind(this);
    this.handleGroupClick = this.handleGroupClick.bind(this);
  }

  componentDidMount = () => {
    this.fetchRoutesForAgency();
    this.getGroups();
  }

  fetchRoutesForAgency = function () {
    const token = localStorage.getItem('busDashboard::token')
    axios.get('/oba/routes/1', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        this.setRoutesForAgency(res.data)

      })
  }

  fetchStopsForRoute = () => {
    const token = localStorage.getItem('busDashboard::token');
    const { busRouteId } = this.state;
    axios.get(`/oba/routes/${busRouteId}/stops`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        this.setStopsByBusRouteId(res.data)

      })
  }

  getGroups = () => {
    const token = localStorage.getItem('busDashboard::token')
    axios.get('/groups', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        this.setState({
          groups: res.data
        })
      })
  }

  getStopsForGroup = () => {
    console.log('getStopsForGroup', this.state)
    const { selectedGroupId } = this.state;
    if (selectedGroupId === '') {
      console.log(selectedGroupId, 'blank')
      this.setState((this.state, { stopsForGroup: [] }))
      return
    }
    const token = localStorage.getItem('busDashboard::token');
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
        console.log(res.data)
        this.setState((this.state, { stopsForGroup: res.data }))
      })
  }

  setRoutesForAgency = (data) => {
    const { list } = data.data.data;
    this.setState({
      routesForAgency: list
    });
  }

  setStopsByBusRouteId = (data) => {
    const { busRouteId } = this.state;
    this.setState({
      stopsByBusRouteId: {
        [busRouteId]: data.data.data,
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
    console.log(groupId);
    const newState = {
      selectedGroupId: groupId,
      busNumber: '',
      busRouteId: '',
      directionIndex: -1
    }
    this.setState((this.state, newState), () => this.getStopsForGroup());
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

  addStop = (e) => {
    console.log('addStop')
    const token = localStorage.getItem('busDashboard::token');
    const { id } = e.target.dataset
    const { selectedGroupId, busRouteId } = this.state;
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



  // getStopsForGroup = () => {
  //   console.log('getStopsForGroup')
  //   const token = localStorage.getItem('busDashboard::token');
  //   const { selectedGroupId } = this.state;
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
  //       console.log(res)
  //       this.setGroupStops(res.data)
  //     })
  // }

  // setGroupStops = (data) => {
  //   const groupStopsForBus = data.filter(stop => { return stop.busId === this.props.busRouteId } )
  //   this.setState({
  //     groupStops: groupStopsForBus
  //   })
  // }

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
              groups={this.state.groups}
              getGroups={this.getGroups}
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
                  stopsForGroup={this.state.stopsForGroup}
                  stopsForDirection={stopsForDirection}
                  addStop={this.addStop}
                  removeStop={this.removeStop}
                >
                </StopList>
              : null
            }
        </form>
        { this.state.selectedGroupId !== ''
          ? <GroupPreviewList
              selectedGroupId={this.state.selectedGroupId}
              routesForAgency={this.state.routesForAgency}
              groups={this.state.groups}
              stopsForGroup={this.state.stopsForGroup}>
            </GroupPreviewList>
          : null
        }
      </div>
    )
  }
}

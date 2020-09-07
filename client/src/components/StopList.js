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
    // const uid = firebase.auth().currentUser.uid;

    // this.unsubscribe = db
    //   .collection('users')
    //   .doc(uid)
    //   .collection('groups')
    //   .doc(this.props.selectedGroupId)
    //   .collection('stops')
    //   .where('busRouteId', '==', this.props.busRouteId)
    //   .onSnapshot(snapshot => {
    //     this.setState({ groupStops: snapshot.docs });
    //   });
  }

  componentWillUnmount() {
    // if (this.unsubscribe) {
    //   this.unsubscribe();
    // }
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
        this.setState({ groupStops: res.data })
      })
  }

  addStop = (e) => {
    console.log('addStop')
    // const uid = firebase.auth().currentUser.uid;
    // const { selectedGroupId } = this.props;
    // db
    //   .collection('users')
    //   .doc(uid)
    //   .collection('groups')
    //   .doc(selectedGroupId)
    //   .collection('stops')
    //   .add({
    //     stopId: e.target.dataset.id,
    //     busRouteId: this.props.busRouteId
    //   })
    const token = localStorage.getItem('busDashboard::token');
    const { id } = e.target.dataset
    const { selectedGroupId } = this.props;
    const data = {
      stopId: id,
      groupId: selectedGroupId
    }
    axios.post('/stops', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res)
      })
      // .then(() => { this.getGroups() })
  }

  removeStop = (e) => {
    console.log('removeStop')
    // const uid = firebase.auth().currentUser.uid;
    // const { selectedGroupId } = this.props;
    // const stop = this.state.groupStops.find(
    //   stop => ( stop.data().stopId === e.target.dataset.id && stop.data().busRouteId === this.props.busRouteId) )
    // db
    //   .collection('users')
    //   .doc(uid)
    //   .collection('groups')
    //   .doc(selectedGroupId)
    //   .collection('stops')
    //   .doc(stop.id)
    //   .delete();
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
              data-id={stop.id}>{stop.name}</li>
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

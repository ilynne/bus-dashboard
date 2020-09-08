import React from 'react';
import _ from 'lodash';
import GroupPreviewCard from './GroupPreviewCard';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class GroupPreviewList extends React.PureComponent {
  state = {
    stops: []
  }

  // componentDidMount() {
  //   this.getStops();
  // }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }

  componentDidMount() {
    this.getStopsForGroup();
  }

  getStopsForGroup = () => {
    console.log('GroupPreviewList getStopsForGroup')
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
        this.setState({ stops: res.data })
      })
  }



  // getStops = () => {
  //   // const uid = firebase.auth().currentUser.uid;
  //   // if (!this.props.selectedGroupId) {
  //   //   return
  //   // }
  //   // this.unsubscribe = db
  //   //   .collection('users')
  //   //   .doc(uid)
  //   //   .collection('groups')
  //   //   .doc(this.props.selectedGroupId)
  //   //   .collection('stops')
  //   //   .onSnapshot(snapshot => {
  //   //     this.setState({ stops: snapshot.docs });
  //   //   });
  // }

  // removeStop = (stopId) => {
  //   console.log('removeStop', id)

  //   // const uid = firebase.auth().currentUser.uid;
  //   // const { selectedGroupId } = this.props;
  //   // db
  //   //   .collection('users')
  //   //   .doc(uid)
  //   //   .collection('groups')
  //   //   .doc(selectedGroupId)
  //   //   .collection('stops')
  //   //   .doc(stopId)
  //   //   .delete();
  // }

  removeStop = (e) => {
    console.log('removeStop', e)
    const token = localStorage.getItem('busDashboard::token');
    const { recordId } = e.target.dataset
    // const { selectedGroupId } = this.props;
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

  busesByStop = () => {
    return _.groupBy(this.state.stops, (stop) => ( stop.stopId ))
  }

  render() {
    const busesByStop = this.busesByStop();
    console.log(busesByStop)

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
  routesForAgency: PropTypes.arrayOf(PropTypes.object).isRequired
}

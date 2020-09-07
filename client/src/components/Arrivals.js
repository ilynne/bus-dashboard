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
  //   console.log('arrivals loaded')
  //   // const uid = firebase.auth().currentUser.uid;
  //   // db
  //   //   .collection('users')
  //   //   .doc(uid)
  //   //   .collection('groups')
  //   //   .doc(this.props.selectedGroupId)
  //   //   .collection('stops')
  //   //   .get()
  //   //   .then(doc => {
  //   //     this.setState({ stops: doc.docs})
  //   //   })
  // }

  busesByStop = () => {
    return _.groupBy(this.state.stops, (stop) => ( stop.stopId ))
  }

  render() {
    const busesByStop = this.busesByStop();
    return (
      <div className="arrivals">
        { Object.keys(busesByStop).map((stopId, i) => (
          <ArrivalCard
            key={`${stopId}-${i}`}
            stopId={stopId}
            busRouteIds={busesByStop[stopId]}
          >
          </ArrivalCard>
        ))}
      </div>
    )
  }
}

Arrivals.propTypes = {
  selectedGroupId: PropTypes.string.isRequired,
}

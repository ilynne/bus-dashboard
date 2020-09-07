import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class TabList extends React.Component {
  state = {
    groups: []
  }
  componentDidMount() {
    this.getGroups();
    // const uid = firebase.auth().currentUser.uid;

    // this.unsubscribe = db
    //   .collection('users')
    //   .doc(uid)
    //   .collection('groups')
    //   .onSnapshot(snapshot => {
    //     this.setState({ groups: snapshot.docs });
    //   });
  }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }
  getGroups = () => {
    const token = localStorage.getItem('busDashboard::token')
    console.log(token)
    axios.get('/groups', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        console.log(res, res.data);
        this.setState({
          groups: res.data
        })
      })
  }


  handleGroupClick = (e) => {
    console.log('click', e)
    this.props.handleGroupClick(e.target.dataset.id)
  }

  render() {
    return (
      <div className="tabs">
        { this.state.groups.map((group) => (
          <div
            className={this.props.selectedGroupId === group._id ? 'selected' : null}
            onClick={this.handleGroupClick}
            key={group._id}
            data-id={group._id}>{group.name}</div>
          ))
        }
        <div
          className={this.props.admin ? 'selected' : null}
          onClick={this.handleGroupClick}
          key={'admin-tab'}
          data-id={'admin'}>Admin</div>
      </div>
    )
  }
}

TabList.propTypes = {
  admin: PropTypes.bool.isRequired,
  selectedGroupId: PropTypes.string.isRequired,
  handleGroupClick: PropTypes.func.isRequired,
}

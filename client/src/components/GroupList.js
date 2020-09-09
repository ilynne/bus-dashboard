import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class GroupList extends React.Component {
  state = {
    name: '',
    origin: '',
    destination: '',
    groups: []
  }

  handleGroupInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleGroupClick = (e) => {
    e.preventDefault();
    const { id, name, origin, destination } = e.target.dataset
    this.setState({
      name: name,
      origin: origin || '',
      destination: destination || ''
    })
    this.props.handleGroupClick(id);
  }

  // handleGroupBlur = (e) => {
  //   // if (this.state.newGroupName === '') {
  //   //   return
  //   // } else {
  //   //   this.addGroup();
  //   // }
  // }

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

  addGroup = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('busDashboard::token');
    const data = { name: this.state.name,
      origin: this.state.origin,
      destination: this.state.destination
    }
    axios.post('/groups', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        this.props.handleGroupClick(res.data._id) //lift state
      })
      .then(() => { this.getGroups() })
  }

  updateGroup = (e) => {
    e.preventDefault();
    const { selectedGroupId } = this.props;
    const token = localStorage.getItem('busDashboard::token');
    const data = {
      name: this.state.name,
      origin: this.state.origin,
      destination: this.state.destination
    }
    axios.put(`/groups/${selectedGroupId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        console.log(res)
      })
  }

  removeGroup = (e) => {
    const token = localStorage.getItem('busDashboard::token');
    const { id } = e.target.dataset
    axios.delete(`/groups/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(() => this.getGroups())
  }

  componentDidMount() {
    this.getGroups();
  }

  render() {
    return (
      <div>
          <p>Group</p>
          <ul>
            { this.state.groups.map((group) => (
              <li
                className={this.props.selectedGroupId === group._id ? 'selected' : null}
                onClick={this.handleGroupClick}
                key={group._id}
                data-id={group._id}
                data-name={group.name}
                data-origin={group.origin}
                data-destination={group.destination}>
                  {group.name}
                  &nbsp;
                  <span
                    className={'clickable delete-link'}
                    data-id={group._id}
                    onClick={this.removeGroup}
                  >
                    delete
                  </span>
              </li>
              ))
            }
          </ul>
          <input
            type={'text'}
            id={'name'}
            name={'name'}
            onChange={this.handleGroupInputChange}
            placeholder={'name'}
            value={this.state.name}
          >
          </input>
          <input
            type={'text'}
            id={'origin'}
            name={'origin'}
            onChange={this.handleGroupInputChange}
            placeholder={'origin'}
            value={this.state.origin}
          >
          </input>
          <input
            type={'text'}
            id={'destination'}
            name={'destination'}
            onChange={this.handleGroupInputChange}
            placeholder={'destination'}
            value={this.state.destination}
          >
          </input>
          <input
            type={'submit'}
            onClick={this.props.selectedGroupId === '' ? this.addGroup : this.updateGroup}
            value={this.props.selectedGroupId === '' ? 'Add' : 'Update'}
            >
          </input>
        </div>
    );
  }
}


GroupList.propTypes = {
  handleGroupClick: PropTypes.func.isRequired,
  selectedGroupId: PropTypes.string.isRequired,
}

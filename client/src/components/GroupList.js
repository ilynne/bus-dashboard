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

  handleGroupSelect = (e) => {
    e.preventDefault();
    const { id } = e.target.dataset
    const selectedGroup = this.props.groups.find(group => group._id === id) || {}
    if (selectedGroup.name !== '') {
      this.setState((this.state, {
        name: selectedGroup.name,
        origin: selectedGroup.origin,
        destination: selectedGroup.destination
      }))
    }
    this.props.handleGroupClick(id);
  }

  handleGroupDeselect = (e) => {
    e.preventDefault();
    this.setState((this.state, { name: '', origin: '', destination: '' }))
    this.props.handleGroupClick('');
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
      .then(() => { this.props.getGroups() })
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
        this.props.getGroups();
      })
  }

  removeGroup = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('busDashboard::token');
    const { id } = e.target.dataset
    axios.delete(`/groups/${id}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(() => this.props.getGroups())
  }

  render() {
    return (
      <div>
          <p>Group</p>
          <ul>
            { this.props.groups.map((group) => (
              <li
                className={this.props.selectedGroupId === group._id ? 'selected' : null}
                onClick={this.props.selectedGroupId === group._id ? this.handleGroupDeselect : this.handleGroupSelect}
                key={group._id}
                data-id={group._id}>
                  {group.name}
                  &nbsp;&nbsp;
                  <span
                    className={this.props.selectedGroupId === group._id ? 'clickable delete-link' : 'hidden'}
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
            value={this.state.name || ''}
          >
          </input>
          <input
            type={'text'}
            id={'origin'}
            name={'origin'}
            onChange={this.handleGroupInputChange}
            placeholder={'origin'}
            value={this.state.origin || ''}
          >
          </input>
          <input
            type={'text'}
            id={'destination'}
            name={'destination'}
            onChange={this.handleGroupInputChange}
            placeholder={'destination'}
            value={this.state.destination || ''}
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
  getGroups: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object).isRequired
}

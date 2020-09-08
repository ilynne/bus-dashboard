import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default class GroupList extends React.Component {
  state = {
    newGroupName: '',
    groups: []
  }

  handleGroupChange = (e) => {
    this.setState({
      newGroupName: e.target.value
    })
  }

  handleGroupClick = (e) => {
    e.preventDefault();
    this.props.handleGroupClick(e.target.dataset.id);
  }

  handleGroupBlur = (e) => {
    if (this.state.newGroupName === '') {
      return
    } else {
      this.addGroup();
    }
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

  addGroup = (groupName) => {
    const token = localStorage.getItem('busDashboard::token');
    const data = { name: this.state.newGroupName }
    axios.post('/groups', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        this.props.handleGroupClick(res.data._id)
      })
      .then(() => { this.getGroups() })
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
                data-id={group._id}>
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
            id={'group-name'}
            name={'group-name'}
            onChange={this.handleGroupChange}
            onBlur={this.handleGroupBlur}
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

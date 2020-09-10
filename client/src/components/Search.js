import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import GroupPreviewList from './GroupPreviewList';

export default class Search extends React.Component {
  state = {
    query: '',
    groups: []
  }

  handleGroupInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.findGroups();
  }

  findGroups = () => {
    const token = localStorage.getItem('busDashboard::token');
    const params = {
      query: this.state.query
    }
    axios.get('/groups', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: params
    })
      .then(res => {
        this.setState((this.state, { groups: res.data } ))
      })
  }

  render() {
    return (
      <div className={"search-container"}>
        <form
          className={'search-form'}
          onSubmit={this.handleFormSubmit}
          method={'post'}>
          <input
            type={'text'}
            id={'query'}
            name={'query'}
            onChange={this.handleGroupInputChange}
            placeholder={'query'}
            value={this.state.query || ''}
          >
          </input>
          <input
            type={'submit'}
            onClick={this.handleFormSubmit}
            value={'Search'}
            >
          </input>
        </form>
        <div className={'search-results-container'}>
          {this.state.groups.map((group) => (
            <div
              className={'search-results'}
              key={`header-${group._id}`}>
              <p>{group.name}</p>
              { group.origin
                ? <p>{group.origin}</p>
                : null
              }
              { group.destination
                ? <p>{group.destination}</p>
                : null
              }
              <GroupPreviewList
                key={group._id}
                routesForAgency={this.props.routesForAgency}
                stopsForGroup={group.stops}
                >
              </GroupPreviewList>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  routesForAgency: PropTypes.arrayOf(PropTypes.object).isRequired,
}

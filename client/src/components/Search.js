import React from 'react';
import TabList from './TabList';
import PropTypes from 'prop-types';
import axios from 'axios';
import GroupPreviewList from './GroupPreviewList';
import SearchPreviewList from './SearchPreviewList';

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
    console.log('search')
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
        console.log(res)
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
            <div className={'search-results'}>
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
}

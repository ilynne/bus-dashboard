import React from 'react';
import logo from './logo.svg';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import Logout from './Logout';

function App() {
  return (
    <div>
      <Signup></Signup>
      <hr />
      <Login></Login>
      <hr />
      <Logout></Logout>
    </div>
  );
}

export default App;

import React from 'react';
import Navbar from './components/Navbar'
import User from './components/User';

function UserPage(props) {
    let username = props.username;
    let loggedIn = props.loggedIn;
    let user = props.user;
    return (
        <>
        <Navbar username={username} loggedIn={loggedIn}/>
        <User username={username} loggedIn={loggedIn} user={user}/>
        </>
    )
}

export default UserPage
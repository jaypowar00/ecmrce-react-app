import React from 'react'
import Navbar from './components/Navbar'
import Products from './components/Products'

function Home(props) {
    let name = props.username;
    let loggedIn = props.loggedIn;
    return (
        <div>
            <Navbar username={name} loggedIn={loggedIn}/>
            <Products/>
        </div>
    )
}

export default Home
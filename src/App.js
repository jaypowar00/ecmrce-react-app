// import logo from './logo.svg';
import { Route } from 'react-router';
import React, { Component } from 'react';
import User from './User';
import Home from './Home';
import axios from 'axios';

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

class App extends Component{
  constructor(props) {
    super(props)
    this.state = {
      name: "Guest",
      loggedIn: "f",
      user: null
    }
    this.setName = this.setName.bind(this);
  }

  setName(){
    console.log("in set name function");
    this.checkUserLoginStatus();
    // this.setState({
    //   name: username
    // },() => {console.log(this.state);});
  }
  componentDidUpdate(){
    this.checkUserLoginStatus();
  }
  componentDidMount(){
    // let username = localStorage.getItem("username");
    // console.log(username);
    // if (username) 
    // this.setState({name: username});
    // else
    // this.setState( prevState =>({
    //   name : prevState.name
    // }))
    this.checkUserLoginStatus();
  }
  checkUserLoginStatus(){
    var access_token = getCookie('accesstoken');
    console.log(access_token);
    if(access_token){
      axios.get('https://ecmrce-suflowapi.herokuapp.com/user/profile',{
        "headers": {
          "Authorization": "Token "+access_token
        }
      }).then(resp => {
        if(resp.data.status){
          if(this.state.loggedIn && this.state.loggedIn!=='f'){
            if(!this.state.username===resp.data.user.username){
              this.setState({
                name:resp.data.user.username,
                loggedIn:true,
                user:resp.data.user
              })
            }
          }else{
            this.setState({name:resp.data.user.username,loggedIn:true,user:resp.data.user})
          }
        }else{
          if(this.state.loggedIn)
          this.setState({loggedIn:false})
        }
        console.log(resp);
      }).catch(error => {
        if(this.state.loggedIn)
          this.setState({loggedIn:false})
        console.log(error);
      })
    }else{
      if(this.state.loggedIn)
        this.setState({loggedIn:false})
    }
  }
  render(){
      return (
        <React.Fragment>
            <Route exact path="/" component={() => <Home username={this.state.name} loggedIn={this.state.loggedIn}/>}></Route>
            <Route path="/user" component={() => <User username={this.state.name} setName={this.setName} loggedIn={this.state.loggedIn} user={this.state.user}/>} ></Route>
        </React.Fragment>
      );
  }
}

export default App;

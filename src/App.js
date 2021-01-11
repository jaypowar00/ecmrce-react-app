// import logo from './logo.svg';
import { Route } from 'react-router';
import React, { Component } from 'react';
import UserPage from './UserPage';
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
  }
  componentDidUpdate(){
    this.checkUserLoginStatus();
  }
  componentDidMount(){
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
        console.log("error in profile request:");
        console.log(error.response.data);
        if(error.response.data.detail === "access token expired!"){
          this.refreshtoken();
        }
      })
    }else{
      if(this.state.loggedIn)
        this.setState({loggedIn:false})
    }
  }
  refreshtoken(){
    var refresh_token = getCookie('refreshtoken');
    if(refresh_token){
      let config = {  headers: {  "refreshtoken": refresh_token  }  }
      axios.post('https://ecmrce-suflowapi.herokuapp.com/user/auth/token-refresh',undefined,config)
      .then(response => {
        if(response.data.status){
            document.cookie = "accesstoken="+response.data.access_token;
            document.cookie = "csrftoken="+response.data.csrf_token;
            document.location.reload();
        }else{
            if(response.data.response)
            console.log(response.data.response);
        }
      })
      .catch(error => {
        console.log("error in refresh-token:");
        console.log(error);
        console.log(error.response);
      })
    }
  }
  render(){
      return (
        <React.Fragment>
            <Route exact path="/" component={() => <Home username={this.state.name} loggedIn={this.state.loggedIn}/>}></Route>
            <Route path="/user" component={() => <UserPage username={this.state.name} setName={this.setName} loggedIn={this.state.loggedIn} user={this.state.user}/>} ></Route>
        </React.Fragment>
      );
  }
}

export default App;

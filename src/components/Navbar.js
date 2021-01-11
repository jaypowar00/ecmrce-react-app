import React, { Component } from 'react'
import './styles/Navbar.css'
import logo from './styles/stackunderflow-logo.png'
import axios from 'axios'
import './styles/spinkit.css'


class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
        username: this.props.username,
        loggedIn: 'f',
      }
      this.n="";
    }
    componentDidMount(){
      this.checkUserLoginStatus();
    }
    checkUserLoginStatus(){
        var access_token = this.props.getCookie('accesstoken');
        if(access_token){
          axios.get('https://ecmrce-suflowapi.herokuapp.com/user/profile',{
            "headers": {
              "Authorization": "Token "+access_token
            }
          }).then(resp => {
            if(resp.data.status){
              if(this.state.loggedIn && this.state.loggedIn!=='f'){
                if(!this.state.username===resp.data.user.username){
                  this.setState({username:resp.data.user.username,loggedIn:true})
                }
              }else{
                this.setState({username:resp.data.user.username,loggedIn:true})
              }
            }else{
              if(this.state.loggedIn)
              this.setState({loggedIn:false})
            }
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
            
    render() {
        return (
          <div>
          <div className="modal fade" id="myModal2">
              <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title" id="myModal2Label">Login Error</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          Error: &lt;&gt;
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal">Try Again</button>
                      </div>
                  </div>
              </div>
          </div>
            <nav className="navbar">
                <div className="navbar-brand">
                    <a href="/">
                        <img className="stackunderflow-logo" src={logo} alt="logo"></img>
                    </a>
                </div>
                <div className="navbar-item">
                    {
                        (this.state.loggedIn && this.state.loggedIn!=='f')?
                        <a href="user">{this.state.username}</a>
                        :
                        (this.state.loggedIn==='f')?
                        <a href={this.n}>loading</a>
                        :
                        <React.Fragment>
                            {/* <a data-toggle="modal" tabIndex="100" href="#myModal1" class="btn btn-primary">Login</a> */}
                            <a href={this.n} className="btn btn-primary" onClick={this.props.handleShow}>Login</a>
                        </React.Fragment>
                    }
                </div>
            </nav>
            </div>
        )
    }
}

export default Navbar

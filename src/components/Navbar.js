import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
// import { Link } from 'react-router'
import './styles/Navbar.css'
import logo from './styles/stackunderflow-logo.png'
import axios from 'axios'
// import $ from 'jquery'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
// import ModalDialog from 'react-bootstrap/ModalDialog'
// import ModalHeader from 'react-bootstrap/ModalHeader'
// import ModalTitle from 'react-bootstrap/ModalTitle'
// import ModalBody from 'react-bootstrap/ModalBody'
// import ModalFooter from 'react-bootstrap/ModalFooter'


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

class Navbar extends Component {
  constructor(props) {
    super(props)
    // this.emailRef = React.createRef();
    // this.passwordRef = React.createRef();
    this.state = {
        username: this.props.username,
        loggedIn: 'f',
        show1: false,
        show2: false
      }
      this.errorMsg = "";
      this.handleClose = this.handleClose.bind(this);
      this.handleClose2 = this.handleClose2.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.handleShow2 = this.handleShow2.bind(this);
      this.login = this.login.bind(this);
      this.n="#";
    }
    handleClose=()=>{
      this.setState({
        show1: false
      });
    }
    handleShow=()=>{
      this.setState({
        show1:true
      });
    }
    handleClose2=()=>{
      this.setState({
        show2:false
      });
    }
    handleShow2=()=>{
      this.setState({
        show1:false,
        show2:true
      });
    }
    componentDidMount(){
        this.checkUserLoginStatus();
        console.log(this.state);
    }
    componentDidUpdate(){
        this.checkUserLoginStatus();
        console.log(this.state);
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
                  this.setState({username:resp.data.user.username,loggedIn:true})
                }
              }else{
                this.setState({username:resp.data.user.username,loggedIn:true})
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

      login(e){
        e.preventDefault();
        let email = document.getElementById("login-email-input").value;
        let password = document.getElementById("login-password-input").value;
        let data = {
            "email" : email,
            "password": password
        }
        axios.post("https://ecmrce-suflowapi.herokuapp.com/user/auth/login",data,{withCredentials:true})
        .then((response)=>{
            console.log(response);
            console.log("___");
            if (response.data.status) {
                console.log(response.data.user);
                // props.setName(response.data.user.username);
                document.cookie = "accesstoken="+response.data.access_token;
                document.cookie = "refreshtoken="+response.data.refresh_token;
                document.cookie = "csrftoken="+response.data.csrf_token;
                // window.location.reload();
                this.handleClose();
                
                // history.push('/');
            }else {
                if(response.data.response){
                  this.errorMsg = response.data.response;
                  console.log("login failed : "+response.data.response);
                  // $('#myModal2').modal('show');
                  this.handleClose();
                  this.handleShow2();
                  // alert("login failed : "+response.data.response);
                    // $('#myModal2').modal({focus:true});
                  }
                  else{
                    this.errorMsg = "";
                    console.log("login failed");
                    this.handleClose();
                    this.handleShow2();
                    // alert("login failed");
                }
            }
        })
    }
            
    render() {
      // <Modal show={this.state.show} onHide={()=>this.handleClose()}>
      //         <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
      //             <div className="modal-content">
      //                 <div className="modal-header">
      //                     <h5 className="modal-title" id="myModal1Label">User Login</h5>
      //                     <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>this.handleClose()}>
      //                         <span aria-hidden="true">&times;</span>
      //                     </button>
      //                 </div>
      //                 <div className="modal-body">
      //                   <form id="modalLoginForm" onSubmit={this.login}>
      //                     <label for="login-email">Enter Email:</label>
      //                     <br/>
      //                     <input type="email" name="loginEmail" ref={this.emailRef} id="login-email" placeholder="email@domain.com" required/>
      //                     <br/>
      //                     <label for="login-password" className="mt-3">Enter password:</label>
      //                     <br/>
      //                     <input type="password" name="loginPassword" ref={this.passwordRef} id="login-password" placeholder="password" required/>
      //                     <br/>
      //                   </form>
      //                 </div>
      //                 <div className="modal-footer">
      //                     <button type="submit" form="modalLoginForm" className="btn btn-success">Login</button>
      //                     <button type="button" className="btn btn-secondary" onClick={()=>this.handleClose()}>Cancle</button>
      //                     {/* <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancle</button> */}
      //                 </div>
      //             </div>
      //         </div>
      //     </Modal>
        return (
          <div>
            <Modal id="myModal1" show={this.state.show1} onHide={this.handleClose} centered>
              <Modal.Header closeButton>
                <Modal.Title>User Login</Modal.Title>
              </Modal.Header>
              <Modal.Body className="modal-body">
                <form id="modalLoginForm" onSubmit={this.login} autocomplete>
                  <label for="login-email">Enter Email:</label>
                  <br/>
                  <input type="email" name="loginEmail" id="login-email-input" placeholder="email@domain.com" required/>
                  <br/>
                  <label for="login-password" className="mt-3">Enter password:</label>
                  <br/>
                  <input type="password" name="loginPassword" id="login-password-input" placeholder="password" required/>
                  <br/>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <button type="submit" form="modalLoginForm" className="btn btn-success">Login</button>
                <button type="button" className="btn btn-primary" onClick={this.handleClose}>Cancle</button>
              </Modal.Footer>
            </Modal>
            
            <Modal id="myModal2" show={this.state.show2} onHide={this.handleClose2} centered backdrop="static" keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title style={{color:"red"}}><h1>Login Error</h1></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {
                  (this.errorMsg && this.errorMsg!=="")?
                  <>Login Failed due to,<br/>{this.errorMsg}</>
                  :
                  <>Login Failed!</>
                }
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={this.handleClose2}>
                  Ok
                </Button>
              </Modal.Footer>
            </Modal>
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
                        <a href="/user">{this.state.username}</a>
                        :
                        (this.state.loggedIn==='f')?
                        <a href={this.n}>loading</a>
                        :
                        <React.Fragment>
                            {/* <a data-toggle="modal" tabIndex="100" href="#myModal1" class="btn btn-primary">Login</a> */}
                            <a href={this.n} className="btn btn-primary" onClick={this.handleShow}>Login</a>
                        </React.Fragment>
                    }
                </div>
            </nav>
            </div>
        )
    }
}

export default Navbar

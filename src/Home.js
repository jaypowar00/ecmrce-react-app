import React, { Component } from 'react'
import Navbar from './components/Navbar'
import Products from './components/Products'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            show1: false,
            show2: false
        }
        this.errorMsg = "";
        this.handleClose = this.handleClose.bind(this);
        this.handleClose2 = this.handleClose2.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleShow2 = this.handleShow2.bind(this);
        this.login = this.login.bind(this);
    }
    handleClose=()=>{
        this.setState({
          show1: false
        });
      }
      handleShow=(e)=>{
        e.preventDefault();
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
      login(e){
        document.getElementById('login-request-loading').innerHTML=`
        <div class="mt-3 mb-n4 sk-wave sk-center">
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
            <div class="sk-wave-rect"></div>
        </div><br>`;
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
                document.cookie = "accesstoken="+response.data.access_token;
                document.cookie = "refreshtoken="+response.data.refresh_token;
                document.cookie = "csrftoken="+response.data.csrf_token;
                document.getElementById('login-request-loading').innerHTML=``;
                this.handleClose();
                window.location.reload();
              }else {
                if(response.data.response)
                  this.errorMsg = response.data.response;
                else
                  this.errorMsg = "";
                document.getElementById('login-request-loading').innerHTML=``;
                this.handleShow2();
              }
            }).catch(error => {
              if(error.response && error.response.data)
                this.errorMsg = error.response.data.detials;
              else
                this.errorMsg = "";
              document.getElementById('login-request-loading').innerHTML=``;
              this.handleShow2();
        })
    }
    render() {
        return (
            <>
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
                        <div id="login-request-loading"></div>
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
                        <>Login Failed due to,<br/><b>{this.errorMsg}</b></>
                        :
                        <>Login Failed!<br/>(check you connectivity)</>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.handleClose2}>
                        Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div>
                    <Navbar username={this.props.name} loggedIn={this.props.loggedIn} handleClose={this.handleClose} handleClose2={this.handleClose2} handleShow={this.handleShow} handleShow2={this.handleShow2} getCookie={this.props.getCookie} />
                    <Products handleClose={this.handleClose} handleClose2={this.handleClose2} handleShow={this.handleShow} handleShow2={this.handleShow2} getCookie={this.props.getCookie} />
                </div>
            </>
        )
    }
}

export default Home
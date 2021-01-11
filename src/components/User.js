import React, { PureComponent } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'


class UserClassComponent extends PureComponent {
    constructor(props) {
        super(props)
        this.email_input = React.createRef();
        this.pass_input = React.createRef();
        this.state = {
             user: this.props.user,
             username: this.props.username,
             loggedIn: this.props.loggedIn
        }
        if(this.state.loggedIn===true){
            document.title= this.state.user.username+" - StackUnderFlow";
        }else if(this.state.loggedIn==="f"){
            document.title= "Loading...";
        }else{
            document.title= "User Login | StackUnderFlow";
        }
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentDidMount(){
        console.log("user component mounted");
        if(this.state.loggedIn===true){
            document.title= this.state.user.username+" - StackUnderFlow";
        }else if(this.state.loggedIn==="f"){
            document.title= "Loading...";
        }else{
            document.title= "User Login | StackUnderFlow";
        }
    }
    login(e){
        document.getElementById('user-login-loading').innerHTML=`
        <div style="margin:15px 0;">
            <div class="sk-wave sk-center">
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
            </div>
        </div>
        `;
        e.preventDefault();
        let email = this.email_input.current.value;
        let password = this.pass_input.current.value;
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
                document.title = response.data.user.username+" | StackUnderFlow";
                this.props.checkLoginStatus();
                document.location.reload();
            }else {
                if(response.data.response){
                    document.title = "User Login | StackUnderFlow";
                    alert("login failed : "+response.data.response);
                    console.log("login failed : "+response.data.response);
                    document.location.reload();
                }
                else{
                    document.title = "User Login | StackUnderFlow";
                    console.log("login failed");
                    alert("login failed");
                    document.location.reload();
                }
            }
        })
    }
    logout(){
        document.getElementById('user-logout-loading').innerHTML=`
        <div style="margin-bottom:-10px;padding-top:15px;">
            <div class="sk-wave sk-center">
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
                <div class="sk-wave-rect"></div>
            </div>
        </div>
        `;
        let access_token = this.props.getCookie('accesstoken');
        let csrf_token = this.props.getCookie('csrftoken');
        let config = {
            headers: {
                "Authorization": "Token "+access_token,
                "X-CSRFToken": csrf_token
            },
            withCredentials:true
        }
        if(access_token){
            axios.post("https://ecmrce-suflowapi.herokuapp.com/user/auth/logout",undefined,config)
            .then(response=>{
                if(response.data.status){
                    alert("successfully logged out!");
                    document.cookie = "accesstoken=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                    document.cookie = "refreshtoken=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                    document.cookie = "csrftoken=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                    document.getElementById('user-logout-loading').innerHTML=``;
                    document.location.reload();
                }else{
                    document.getElementById('user-logout-loading').innerHTML=``;
                    if(response.data.response)
                        alert("logout failed : "+response.data.response);
                    else
                        alert("logout failed!");
                    document.location.reload();
                }
            }).catch(error => {
                document.getElementById('user-logout-loading').innerHTML=``;
                if(error.response && error.response.data)
                    alert("logout failed: "+ error.response.data.details);
                else
                    alert("logout failed: server error...");
                document.location.reload();
            })
        }
    }
    render() {
        return (
            <>
        {/* <Navbar username={username} loggedIn={loggedIn}/> */}
        <div className="user-form">
            {
                (this.state.loggedIn & this.state.loggedIn !== 'f')?
                <>
                <div className="profile-user-wrapper">
                    <div className="profile-top-wrapper">
                        <div className="profile-top-item">
                            <div id="profile-photo-container">
                                <div id="profile-photo-text">
                                    {this.state.username.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <div className="profile-top-item">
                            <h1>{this.state.username}</h1><br/><br/>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="profile-content-wrapper">
                        <div id="user-info">
                            <p><b>Username :</b> {this.state.user.username} </p>
                            <p><b>E-mail :</b> {this.state.user.email} </p>
                            <p><b>Phone No. :</b> {(this.state.user.phone && this.state.user.phone!==null)?this.state.user.phone:<>not provided</>}</p>
                            <p><b>Address :</b></p>
                            <div className="ml-3" id="user-address">
                                <b>Area :</b> {(this.state.user.address.area && this.state.user.address.area!==null)?this.state.user.address.area:<>---</>} <br/>
                                <b>City :</b> {(this.state.user.address.city && this.state.user.address.city!==null)?this.state.user.address.city:<>---</>} <br/>
                                <b>Country :</b> {(this.state.user.address.country && this.state.user.address.country!==null)?this.state.user.address.country:<>---</>} <br/>
                                <b>Landmark :</b> {(this.state.user.address.landmark && this.state.user.address.landmark!==null)?this.state.user.address.landmark:<>---</>} <br/>
                                <b>Pincode :</b> {(this.state.user.address.pinCode && this.state.user.address.pinCode!==null)?this.state.user.address.pinCode:<>---</>} <br/>
                                <b>State :</b> {(this.state.user.address.state && this.state.user.address.state!==null)?this.state.user.address.state:<>---</>} <br/>
                                <b>Type :</b> {(this.state.user.address.type && this.state.user.address.type!==null)?this.state.user.address.type:<>---</>} <br/><br/>
                            </div>
                        </div>
                    </div>
                    <div id="user-logout-loading"></div>
                    <input className="mt-4 btn btn-danger" id="logout-btn" type="button" value="Logout" onClick={this.logout}></input><br/>
                </div>
                </>
                :
                (this.state.loggedIn === 'f')?<div className="container text-center">
                <div style={{marginTop: "34px"}}>
                    <div className="mt-5 sk-wave sk-center">
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                    </div>
                </div>
                </div>:
                <div className="login-user">
                    <form onSubmit={this.login} autocomplete>
                    <label htmlFor="email">Enter Email Address:</label><br/>
                    <input type="email" name="loginEmail" ref={this.email_input} placeholder="email@domain.com" required/><br/><br/>
                    <label htmlFor="password">Enter Password;</label><br/>
                    <input type="password" name="loginPassword" ref={this.pass_input} placeholder="password" required/>
                    <div id="user-login-loading"></div><br/>
                    <input className="btn btn-success" id="login-btn" type="submit" value="login"/><br/><br/>
                    </form>
                    
                </div>
            }
        </div>
        </>
        )
    }
}

export default withRouter(UserClassComponent)

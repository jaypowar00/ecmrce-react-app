import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles/User.css';
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

function User(props) {
    let history = useHistory();
    let username = props.username;
    let loggedIn = props.loggedIn;
    let user = props.user;
    if(loggedIn===true){
        document.title= user.username+" - StackUnderFlow";
    }else if(loggedIn==="f"){
        document.title= "loading";
    }else{
        document.title= "login user - StackUnderFlow";
    }
    console.log(loggedIn);
    let email_input = React.createRef();
    let pass_input = React.createRef();

    function login(e){
        e.preventDefault();
        let email = email_input.current.value;
        let password = pass_input.current.value;
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
                history.push('/');
            }else {
                if(response.data.response){
                    alert("login failed : "+response.data.response);
                    console.log("login failed : "+response.data.response);
                }
                else{
                    console.log("login failed");
                    alert("login failed");
                }
            }
        })
    }
    function logout(){
        let access_token = getCookie('accesstoken');
        let csrf_token = getCookie('csrftoken');
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
                    history.push('/');
                }else{
                    if(response.data.response)
                        alert("logout failed : "+response.data.response);
                    else
                        alert("logout failed!");
                }
            })
        }
    }
    return (
        <>
        {/* <Navbar username={username} loggedIn={loggedIn}/> */}
        <div className="user-form">
            {
                (loggedIn & loggedIn !== 'f')?
                <>
                <div className="profile-user-wrapper">
                    <div className="profile-top-wrapper">
                        <div className="profile-top-item">
                            <div id="profile-photo-container">
                                <div id="profile-photo-text">
                                    {username.charAt(0)}
                                </div>
                            </div>
                        </div>
                        <div className="profile-top-item">
                            <h1>{username}</h1><br/><br/>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="profile-content-wrapper">
                        <div id="user-info">
                            <p><b>Username :</b> {user.username} </p>
                            <p><b>E-mail :</b> {user.email} </p>
                            <p><b>Phone No. :</b> {(user.phone && user.phone!==null)?user.phone:<>not provided</>}</p>
                            <p><b>Address :</b></p>
                            <div className="ml-3" id="user-address">
                                <b>Area :</b> {(user.address.area && user.address.area!==null)?user.address.area:<>---</>} <br/>
                                <b>City :</b> {(user.address.city && user.address.city!==null)?user.address.city:<>---</>} <br/>
                                <b>Country :</b> {(user.address.country && user.address.country!==null)?user.address.country:<>---</>} <br/>
                                <b>Landmark :</b> {(user.address.landmark && user.address.landmark!==null)?user.address.landmark:<>---</>} <br/>
                                <b>Pincode :</b> {(user.address.pinCode && user.address.pinCode!==null)?user.address.pinCode:<>---</>} <br/>
                                <b>State :</b> {(user.address.state && user.address.state!==null)?user.address.state:<>---</>} <br/>
                                <b>Type :</b> {(user.address.type && user.address.type!==null)?user.address.type:<>---</>} <br/><br/>
                            </div>
                        </div>
                    </div>
                    <input className="btn btn-danger" id="logout-btn" type="button" value="Logout" onClick={logout}></input><br/>
                </div>
                </>
                :
                (loggedIn === 'f')?<div className="container text-center">loading</div>:
                <div className="login-user">
                    <form onSubmit={login}>
                    in Guest Mode<br/><br/>
                    Enter Email Address:<br/>
                    <input type="email" ref={email_input} required/><br/><br/>
                    Enter Password;<br/>
                    <input type="password" ref={pass_input} required/><br/><br/>
                    <input className="btn btn-success" type="submit" value="login"/>
                    </form>
                    
                </div>
            }
        </div>
        </>
    )
}

export default User
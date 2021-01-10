import React from 'react';
import { useHistory } from 'react-router-dom';
import './components/styles/User.css';
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
    console.log(loggedIn);
    let email_input = React.createRef();
    let pass_input = React.createRef();

    // function changeName(){
    //     if(email_input.current.value && email_input.current.value!=""){
    //         console.log("chagning name to "+email_input.current.value);
    //         localStorage.setItem("username",email_input.current.value);
    //         props.setName(email_input.current.value);
    //     }
    //     // history.push("/");
    // }
    // function logout(){
    //     if(localStorage.getItem("username")){
    //         localStorage.removeItem("username");
    //         props.setName("Guest");
    //         // history.push("/");
    //     }
    // }
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
                props.setName(response.data.user.username);
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
        <div className="user-form">
            {
                (loggedIn & loggedIn !== 'f')?
                <div>
                    logged user: {username}<br/><br/>
                    <div id="user-info">
                        <b>email :</b> {user.email} <br/>
                        <b>phone :</b> {(user.phone && user.phone!==null)?user.phone:<>unknown</>} <br/>
                        <b>address :</b><br/>
                        <div id="user-addressdetail">
                            <b>area :</b> {(user.address.area && user.address.area!==null)?user.address.area:<>unknown</>} <br/>
                            <b>city :</b> {(user.address.city && user.address.city!==null)?user.address.city:<>unknown</>} <br/>
                            <b>country :</b> {(user.address.country && user.address.country!==null)?user.address.country:<>unknown</>} <br/>
                            <b>landmark :</b> {(user.address.landmark && user.address.landmark!==null)?user.address.landmark:<>unknown</>} <br/>
                            <b>pincode :</b> {(user.address.pincode && user.address.pincode!==null)?user.address.pincode:<>unknown</>} <br/>
                            <b>state :</b> {(user.address.state && user.address.state!==null)?user.address.state:<>unknown</>} <br/>
                            <b>type :</b> {(user.address.type && user.address.type!==null)?user.address.type:<>unknown</>} <br/><br/>
                        </div>
                    </div>
                    <input type="button" value="logout" onClick={logout}></input>
                </div>
                :
                (loggedIn === 'f')?<div className="container text-center">loading</div>:
                <div className="login-user">
                    <form onSubmit={login}>
                    in Guest Mode<br/><br/>
                    Enter Email Address:<br/>
                    <input type="email" ref={email_input} required/><br/><br/>
                    Enter Password;<br/>
                    <input type="password" ref={pass_input} required/><br/><br/>
                    <input type="submit" value="login"/>
                    </form>
                    
                </div>
            }
        </div>
    )
}

export default User
import React from 'react';
import GoogleLogin from 'react-google-login';
import { Redirect } from 'react-router-dom';

import '../styles/sign-in-styles.css'

export class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loginSuccess: false, user: false, name: null, email: null, photoUrl: null, admin: false };
        this.checkDatabase = this.checkDatabase.bind(this);
        this.postData = this.postData.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    // check if user profile is in database
    async checkDatabase() {
        // check database
        const url = "http://ips-backend.herokuapp.com/users/" + this.state.email + "/";
        const userCheck = await fetch(url);
        const data = await userCheck.text();
        if (data !== "") {
            console.log("User profile exists.");
            this.setState({ user: true });
        }

        // post data to API if user profile does not exist
        if (!this.state.user) {
            console.log("User profile does not exist.");
            this.postData();
        }

        // check whether user is admin
        if (this.state.email === "finix.ips@gmail.com") {
            console.log("User is an admin.");
            this.setState({ admin: true });
        }

        console.log("Login success.");
        this.setState({ loginSuccess: true });
    }

    // post data to API if user profile does not exist
    postData() {
        fetch("http://ips-backend.herokuapp.com/users/", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userName: this.state.name,
                userEmail: this.state.email,
                userPhotoUrl: this.state.photoUrl,
                userRole: 1
            })
        });
        console.log("User data has been posted to API.");
    }

    // handler function for Google Login response
    handleResponse(response) {
        console.log("Google login:", response);

        // save user's name, email and URL to profile picture
        this.setState({ 
            name: response.profileObj.name, 
            email: response.profileObj.email, 
            photoUrl: response.profileObj.imageUrl });

        // check whether user profile is in database
        this.checkDatabase();
    }

    render() {
        // redirect admin to admin page
        if (this.state.loginSuccess && this.state.admin) {
            console.log("User is being redirected to admin page.");
            return (
                <Redirect to={{
                    pathname: "/admin-page"
                    }}>
                </Redirect>
            )
        }

        // redirect user to home page if login success
        if (this.state.loginSuccess) {
            console.log("User is being redirected to home page.");
            return (
                <Redirect to={{
                    pathname: "/home-page",
                    state: { email: this.state.email }
                    }}>
                </Redirect>
            )
        }

        else {
            return (
                <div>
                    <div className="sign-in-header">SIGN IN</div>
                    <div className="sign-in-container">
                        <div className="google-sign-in">Google Sign In</div>
                        <GoogleLogin 
                            clientId="958388921127-qdg18otoga0ru7d8uq4g2dblm7pa9qrb.apps.googleusercontent.com"
                            buttonText="Sign In"
                            onFailure={this.handleResponse}
                            onSuccess={this.handleResponse}
                            cookiePolicy={'single_host_origin'}
                            className="google-login"
                        />
                    </div>
                </div>
            )
        }
    }
}
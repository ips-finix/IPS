import React from 'react';
import { Link } from 'react-router-dom';

import { Navigation } from "./Navigation";
import userPlaceholder from "../images/user.png";

import '../styles/home-page-styles.css';

// global variables
let pairButton;    // render pair button based on different conditions
let userPhoto;

export class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, user: null, tag: false, notification: false };
        this.postData = this.postData.bind(this);
        this.unsubscribeNotification = this.unsubscribeNotification.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        // retrieve user data
        const userEmail = this.props.location.state.email;
        const url = "http://ips-backend.herokuapp.com/users/" + userEmail + "/";
        const response = await fetch(url);
        const userData = await response.json();
        console.log("User data:", userData);
        this.setState({ user: userData, loading: false });

        // set state of component passed in from other components
        this.setState({ tag: this.props.location.state.pairedTag });
        this.setState({ notification: this.props.location.state.notification });
    }

    // post data to API to record user's visit history
    async postData() {
        // retrieve location of user
        const userTag = this.props.location.state.tagID;
        const url = "http://ips-backend.herokuapp.com/coordinates/tags/" + userTag + "/";
        const response = await fetch(url);
        const locationData = await response.json();

        // calculate duration
        const endTime = Date.now();
        const totalDuration = (endTime - this.props.location.state.startTime) / 1000
        console.log("Total duration spent at location:", totalDuration, "seconds");

        // post data to API 
        fetch("http://ips-backend.herokuapp.com/visits/", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                place: locationData.place.placeID,
                user: this.state.user.userID,
                tag: this.props.location.state.tagID,
                datetime: endTime,
                duration: totalDuration
            })
        });
        console.log("User's visit data has been posted to API.");
    }

    // post data to API to unsubscribe to notifications
    unsubscribeNotification() {
        fetch("http://ips-backend.herokuapp.com/notifications/", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                tag: this.props.location.state.tagID,
                accessToken: this.props.location.state.token,
                mode: "unsubscribe"
            })
        });
        console.log("Notification has been unsubscribed.");
    }

    // handler function when 'pair' button is clicked
    handleClick() {
        // post data to API to record user's visit history
        this.postData();

        // unsubscribe to notification if notification has been subscribed
        if (this.state.notification) 
            this.unsubscribeNotification();

        this.setState({ tag: false, notification: false });
    }

    // handler function when drawer is toggled
    drawerToggleClickHandler = () => {
        this.setState((prevState) => {
          return {sideDrawerOpen: !prevState.sideDrawerOpen};
        });
    };

    render() {
        // when user data is being loaded
        if (this.state.loading) {
            console.log("Loading user data...");
            return <div className="loading">Loading...</div>
        }

        // when user failed to be loaded
        if (!this.state.user) {
            console.log("Loading failed.")
            return <div className="loading">Failed to load user.</div>
        }
    
        // if user does not have a profile picture
        if (this.state.user.userPhotoUrl === null)
            userPhoto = <img className="user-photo" src={userPlaceholder} alt=""></img>
        // if user has a profile picture
        else
            userPhoto = <img className="user-photo" src={this.state.user.userPhotoUrl} alt=""></img>

        // button to render when tag has been paired 
        if (this.state.tag) {
            pairButton = <button className="pairing-button" onClick={this.handleClick}>STOP PAIRING</button>
        }
        // button to render when tag has not been paired 
        else {
            pairButton = 
                <Link to={{
                        pathname: "/tag-pairing",
                        state: { 
                        email: this.state.user.userEmail, 
                        userID: this.state.user.userID.toString(),
                        notification: this.state.notification,
                        pairedTag: this.state.tag,
                        tagID: this.props.location.state.tagID,
                        startTime: this.props.location.state.startTime,
                        token: this.props.location.state.token }
                    }}>
                    <button className="pairing-button">START PAIRING</button>
                </Link>
        }

        return (
            <div>
                <div className="home-header">HOME</div>
                <div className="home-container">
                    <div className="user-name">{this.state.user.userName}</div>
                    <div className="user-email">{this.state.user.userEmail}</div>
                    {userPhoto}
                </div>
                {pairButton}
                <Navigation 
                    email={this.state.user.userEmail} 
                    userID={this.state.user.userID.toString()} 
                    notification={this.state.notification}
                    pairedTag={this.state.tag}
                    tagID={this.props.location.state.tagID}
                    startTime={this.props.location.state.startTime}
                    token={this.props.location.state.token}/>
            </div>
        ) 
    }
}
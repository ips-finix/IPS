import React from 'react';
import { store } from 'react-notifications-component';

import { Navigation } from "./Navigation";
import { messaging } from "../Firebase";
import locationPlaceholder from "../images/location.png";

import '../styles/current-location-styles.css';
import '../../node_modules/react-notifications-component/dist/theme.css';

// global variables
let notifButton;    // render notification button based on different conditions
let locationName;
let locationPhoto;

export class CurrentLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { subscribed: false, tag: false, loading: true, location: false, token: null };
        this.sendTokenToServer = this.sendTokenToServer.bind(this);
        this.subscribeNotification = this.subscribeNotification.bind(this);
        this.unsubscribeNotification = this.unsubscribeNotification.bind(this);
        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
    }

    async componentDidMount() {
        // retrieve location of user 
        if (this.props.location.state.pairedTag) {
            const userTag = this.props.location.state.tagID;
            const url = "http://ips-backend.herokuapp.com/coordinates/tags/" + userTag + "/";
            const response = await fetch(url);
            const locationData = await response.json();
            console.log("Location data:", locationData);
            this.setState({ location: locationData, loading: false });
        } 

        // set state of component passed in from other components
        if (typeof this.props.location.state.notification !== "undefined")
            this.setState({ subscribed: this.props.location.state.notification });

        if (typeof this.props.location.state.token !== "undefined")
            this.setState({ token: this.props.location.state.token });

        this.setState({ tag: this.props.location.state.pairedTag });
    }

    // send token to server
    async sendTokenToServer(token) {
        fetch("http://ips-backend.herokuapp.com/notifications/", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                tag: this.props.location.state.tagID,
                accessToken: token,
                mode: "subscribe"
            })
        });
        console.log("Notification has been subscribed.");
    }

    // post data to API to subscribe to notifications
    subscribeNotification() {
        messaging.getToken().then((currentToken) => {
            console.log("Token:", currentToken);
            if (currentToken) 
                this.sendTokenToServer(currentToken);
            else {
                console.log("No Instance ID token available. Request permission to generate one.");
                Notification.requestPermission().then(function(permission) {
                    console.log(permission);
                });
            }
            this.setState({ token: currentToken });
        }).catch((err) => {
            console.log("An error occurred while retrieving token.", err);
        });
    
        messaging.onMessage((payload) => {
            console.log("Message received.", payload);
            // push notification to users
            store.addNotification({
                title: "Warning!",
                message: "You are in close distance with others.",
                type: "default",
                container: "top-center",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                    duration: 5000
                }
            })
        });
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
                accessToken: this.state.token,
                mode: "unsubscribe"
            })
        });
        console.log("Notification has been unsubscribed.");
    }

    // handler function when 'subscribed' button is clicked
    handleSubscribe() {
        this.subscribeNotification();
        this.setState({ subscribed: true });
    }

    // handler function when 'unsubscribed' button is clicked
    handleUnsubscribe(){
        this.unsubscribeNotification();
        this.setState({ subscribed: false });
    }

    render() {
        // when user location is being loaded
        if (this.props.location.state.pairedTag && this.state.loading) {
            return <div className="loading">Loading...</div>
        }

        // when a tag has not been paired and user location cannot be displayed
        if (!this.props.location.state.pairedTag && !this.state.location) {
            locationName = <div className="location-name">No location detected.</div>
            locationPhoto = <img className="location-photo" src={locationPlaceholder} alt=""></img>
        }
        // when a tag has been paired and user location can be displayed
        else {
            locationName = <div className="location-name">{this.state.location.place.placeName}</div>
            console.log(this.state.location.place.placePhotoUrl);
            if (this.state.location.place.placePhotoUrl === null)
                locationPhoto = <img className="location-photo" src={locationPlaceholder} alt=""></img>
            else
                locationPhoto = <img className="location-photo" src={this.state.location.place.placePhotoUrl} alt=""></img>
        }

        // button to render when tag has not been paired
        if (!this.state.tag) {
            notifButton = <button className="subscribed-button">SUBSCRIBE NOTIFICATION</button>
        }
        // button to render when tag has been paired and notification has been subscribed
        else if (this.state.subscribed && this.state.tag) {
            notifButton = <button className="subscribe-button" onClick={this.handleUnsubscribe}>UNSUBSCRIBE NOTIFICATION</button>
        }
        // button to render when tag has been paired and notification has not been subscribed
        else {
            notifButton = <button className="subscribe-button" onClick={this.handleSubscribe}>SUBSCRIBE NOTIFICATION</button>
        }

        return (
            <div>
                <div className="location-header">CURRENT LOCATION</div>
                <div className="location-container">
                    {locationName}
                    {locationPhoto}
                </div>
                <div className="subscribe-message">To receive alerts for social distancing,</div>
                <div className="subscribe-message">please subscribe to our notification.</div>
                {notifButton}
                <Navigation 
                    email={this.props.location.state.email} 
                    userID={this.props.location.state.userID}
                    notification={this.state.subscribed}
                    pairedTag={this.state.tag}
                    tagID={this.props.location.state.tagID}
                    startTime={this.props.location.state.startTime}
                    token={this.state.token}/>
            </div>
        )
    }
}
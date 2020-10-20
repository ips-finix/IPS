import React from 'react';
import { Redirect } from 'react-router-dom';

import { Navigation } from "./Navigation";

import '../styles/tag-pairing-styles.css';

// global variables
let tagButton;
let header;
let tagID;
let errorMsg = "";

export class TagPairing extends React.Component {
    constructor(props) {
        super(props);
        this.state = { tagID: "", tag: false, first: false, startTime: null };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        // set state of component passed in from other components
        this.setState({ tag: this.props.location.state.pairedTag });

        if (this.props.location.state.pairedTag) 
            this.setState({ tagID: this.props.location.state.tagID });

        if (typeof this.props.location.state.startTime !== "undefined")
            this.setState({ startTime: this.props.location.state.startTime });
    }

    // handler function when user inputs tag ID
    handleChange(e) {
        const inputID = e.target.value;
        this.setState({ tagID: inputID });
    }

    // handler function when 'continue' button is clicked
    async handleClick() {
        // check validity of tag
        const url = "https://ips-backend.herokuapp.com/tags/";
        const response = await fetch(url);
        const tagData = await response.json();

        let i;
        let valid = false;
        for (i = 0; i < tagData.length; i++) {
            if (tagData[i] === this.state.tagID)
                valid = true;
        }

        // valid tag ID
        if (valid) {
            console.log("Tag has been paired.");
            const time = Date.now();    // get current time
            errorMsg = <div className="error-msg"></div>  
            this.setState({ tag: true, first: true, startTime: time });
        }
        // invalid tag ID
        else {
            console.log("Tag ID is invalid.");
            errorMsg = <div className="error-msg">Please enter a valid tag ID.</div>
            this.setState({ tag: false });
        }
    }
   
    render() {
        // redirect user to current location page when tag is first being paired
        if (this.state.tag && this.state.first) {
            console.log("User is being redirected to 'Current Location' page.");
            tagButton = 
                <Redirect to={{
                    pathname: "/current-location",
                    state: { 
                        email: this.props.location.state.email, 
                        userID: this.props.location.state.userID, 
                        notification: this.props.location.state.notification,
                        pairedTag: this.state.tag,
                        tagID: this.state.tagID,
                        startTime: this.state.startTime,
                        token: this.props.location.state.token }
                    }}>
                </Redirect>
        }

        // display tag ID when tag has been paired
        else if (this.state.tag) {
            const currentTag = "#" + this.state.tagID;
            header = <div className="current-tag-header">Current Tag ID</div>
            tagID = <div className="current-tag-id">{currentTag}</div>
            tagButton = <button className="paired-button">TAG HAS BEEN PAIRED</button>
        }

        // ask user to enter tag ID when tag has not been paired
        else if (!this.state.tag) {
            header = <div className="current-tag-header">Enter Tag ID</div>
            tagID = <input 
                        className="tag-id"
                        onChange={this.handleChange}
                        type="text"
                        placeholder="Tag ID"
                        value={this.state.tagID}>
                    </input>
            tagButton = <button className="continue-button" onClick={this.handleClick}>CONTINUE</button>
        }

        return (
            <div>
                <div className="tag-pairing-header">TAG PAIRING</div>
                <div className="tag-container">
                    {header}
                    {tagID}
                </div>
                {errorMsg}
                <div className="terms-message">By using our services, you agree to our</div>
                <div className="terms-message">Terms of Service and Privacy Policy.</div>
                {tagButton}
                <Navigation 
                    email={this.props.location.state.email} 
                    userID={this.props.location.state.userID} 
                    notification={this.props.location.state.notification}
                    pairedTag={this.state.tag}
                    tagID={this.state.tagID}
                    startTime={this.state.startTime}
                    token={this.props.location.state.token}/>
            </div>
        )
    }
}
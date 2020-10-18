import React from 'react';

import { Navigation } from "./Navigation";

import '../styles/visit-history-styles.css';

export class VisitHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, visitList: null };
    }

    // retrieve user data
    async componentDidMount() {
        const userID = this.props.location.state.userID;
        const url = "http://ips-backend.herokuapp.com/visits/" + userID + "/";
        const response = await fetch(url);
        const historyData = await response.json();
        console.log("History data:", historyData);
        this.setState({ visitList: historyData, loading: false })
    }

    render() {
        // when user data is being loaded
        if (this.state.loading) {
            return <div className="loading">Loading...</div>
        }

        // when there is no visit history
        if (!this.state.visitList) {
            return <div>No visit history</div>
        }

        return (
            <div>
                <div className="visit-history-header">VISIT HISTORY</div>
                <div>
                    {this.state.visitList.reverse().map((item, index) => {
                        return (
                            <div key={index}>
                                <button className="place-button">
                                    <div className="place-name">{item.place.placeName}</div>
                                    <div className="visit-date">{item.datetime.substring(0, 10)}</div>
                                    <div className="visit-time">{item.datetime.substring(12, 16)}</div>
                                </button>
                            </div>
                        )
                    })}
                </div>
                <Navigation 
                    email={this.props.location.state.email} 
                    userID={this.props.location.state.userID}
                    notification={this.props.location.state.notification}
                    pairedTag={this.props.location.state.pairedTag}
                    tagID={this.props.location.state.tagID}
                    startTime={this.props.location.state.startTime}
                    token={this.props.location.state.token}/>
            </div>
        )
    }
}
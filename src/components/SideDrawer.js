import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemIcon } from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import BluetoothConnectedIcon from '@material-ui/icons/BluetoothConnected';
import RoomIcon from '@material-ui/icons/Room';
import HistoryIcon from '@material-ui/icons/History';

import '../styles/side-drawer-styles.css';

export class SideDrawer extends React.Component {
  render() {
    // set name for drawer based on different conditions
    let drawerClasses = 'side-drawer';

    if (this.props.show) {
      drawerClasses = 'side-drawer open';
    }

    return (
      <div className={drawerClasses}>
        <List className="nav-list">
          <Link className="home-nav" 
                to={{
                  pathname: "/home-page",
                  state: { 
                    email: this.props.email, 
                    userID: this.props.userID, 
                    notification: this.props.notification, 
                    pairedTag: this.props.pairedTag,
                    tagID: this.props.tagID,
                    startTime: this.props.startTime,
                    token: this.props.token }
                  }} 
                onClick={this.props.navHandler}>
            <ListItem button> 
              <ListItemIcon>
                <HomeIcon className="home-icon"/>
              </ListItemIcon>Home
            </ListItem>
          </Link>
          <Link className="tag-pairing-nav" 
                to={{
                  pathname: "/tag-pairing",
                  state: { 
                    email: this.props.email, 
                    userID: this.props.userID, 
                    notification: this.props.notification, 
                    pairedTag: this.props.pairedTag,
                    tagID: this.props.tagID,
                    startTime: this.props.startTime,
                    token: this.props.token }
                  }}  
                onClick={this.props.navHandler}>
            <ListItem button>
              <ListItemIcon>
                <BluetoothConnectedIcon className="bluetooth-icon"/>
              </ListItemIcon>Tag Pairing
            </ListItem>
          </Link>
          <Link className="current-location-nav" 
                to={{
                  pathname: "/current-location",
                  state: { 
                    email: this.props.email, 
                    userID: this.props.userID, 
                    notification: this.props.notification, 
                    pairedTag: this.props.pairedTag,
                    tagID: this.props.tagID,
                    startTime: this.props.startTime,
                    token: this.props.token }
                  }}  
                onClick={this.props.navHandler}>
            <ListItem button>
              <ListItemIcon>
                <RoomIcon className="room-icon"/>
              </ListItemIcon>Current Location
            </ListItem>
          </Link>
          <Link className="visit-history-nav" 
                to={{
                  pathname: "/visit-history",
                  state: { 
                    email: this.props.email, 
                    userID: this.props.userID, 
                    notification: this.props.notification, 
                    pairedTag: this.props.pairedTag,
                    tagID: this.props.tagID,
                    startTime: this.props.startTime,
                    token: this.props.token }
                  }}  
                onClick={this.props.navHandler}>
            <ListItem button>
              <ListItemIcon>
                <HistoryIcon className="history-icon"/>
              </ListItemIcon>Visit History
            </ListItem>
          </Link>
        </List>
      </div>
    )
  }
}
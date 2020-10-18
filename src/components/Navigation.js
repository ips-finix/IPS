import React from 'react';

import { Toolbar } from './Toolbar';
import { SideDrawer } from './SideDrawer';
import Backdrop from './Backdrop';

export class Navigation extends React.Component {
    // state of side drawer
    state = {
        sideDrawerOpen: false
    };

    // handler function when drawer is toggled
    drawerToggleClickHandler = () => {
        this.setState((prevState) => {
            return {sideDrawerOpen: !prevState.sideDrawerOpen};
        });
    };

    // handler function when navigation is clicked
    navClickHandler = () => {
        this.setState({sideDrawerOpen: false});
    }

    // handler function when backdrop is clicked
    backdropClickHandler = () => {
        this.setState({sideDrawerOpen: false});
    };

    render() {
        let backdrop;    

        // render backdrop if side drawer is opened
        if (this.state.sideDrawerOpen) {
            backdrop = <Backdrop click={this.backdropClickHandler} />
        }

        return (
            <div style={{height: '100%'}}>
                <main style={{marginTop: '64px'}}>
                    <div></div>
                </main>
                <Toolbar drawerClickHandler={this.drawerToggleClickHandler} />
                <SideDrawer 
                    show={this.state.sideDrawerOpen} 
                    navHandler={this.navClickHandler} 
                    email={this.props.email}
                    userID={this.props.userID}
                    notification={this.props.notification}
                    pairedTag={this.props.pairedTag}
                    tagID={this.props.tagID}
                    startTime={this.props.startTime}
                    token={this.props.token}/>
                {backdrop}
            </div>
        )           
    }
}
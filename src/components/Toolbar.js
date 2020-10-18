import React from 'react';

import DrawerToggleButton from './DrawerToggleButton';

import '../styles/toolbar-styles.css';

export class Toolbar extends React.Component {
  render() {
    return (
      <div>
        <header className="toolbar">
          <nav className="toolbar-navigation">
              <div className="toolbar-toggle-button">
                  <DrawerToggleButton click={this.props.drawerClickHandler} />
              </div>
          </nav>
        </header>
      </div>
    )
  }
}
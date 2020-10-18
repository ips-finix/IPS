import React from 'react';

import '../styles/backdrop-styles.css';

const backdrop = props => (
    <div className="backdrop" onClick={props.click} />
);

export default backdrop;
import React from 'react';
import proj4 from 'proj4';
import Plot from 'react-plotly.js';

import { roomShapes } from '../data/admin_geojson';

import '../styles/admin-page-styles.css';

const proj_transformer = proj4('GOOGLE', 'WGS84');

export class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        this.plotJSON = {
            data: [], 
            layout: {
                geo: { projection: { type: 'mercator' } },
                autosize: true,
                mapbox: {
                    style: "open-street-map",
                    center: {lon: 101.60035664, lat: 3.06473362},
                    zoom: 17, layers: [{
                        source: roomShapes,
                        type: "fill", below: "traces", color: "lightgrey"}]},
                margin: {'l': 0, 'r': 0, 'b': 0, 't': 0},
                height: 700
            }
        };
        this.state = { json: this.plotJSON, tagCount: 0, closeContactCount: 0 };
        this.populateMap = this.populateMap.bind(this);
    }

    intervalID;
    async componentDidMount() {
        // populate location map
        this.populateMap();

        // set interval to update map once every 30 seconds
        this.intervalID = setInterval(this.populateMap.bind(this), 3000);
    }

    // populate location map
    async populateMap() {
        // get list of coordinates from api
        const url = "https://ips-backend.herokuapp.com/coordinates/places/1/";
        const response = await fetch(url);
        const response_data = await response.json();
        console.log("Coordinates:", response_data);

        // convert coordinates from EPSG:3857 to EPSG:4326
        var coord_4326 = response_data.map(coord => 
            proj_transformer.forward([coord.y, coord.x])
        );

        this.plotJSON.data = [{
            type: 'scattermapbox',
            lat: coord_4326.map(coord => coord[1]),
            lon: coord_4326.map(coord => coord[0]),
            marker: {
                color: coord_4326.map(coord => coord.isCloseContact ? "BE3545" : "#7565AB")
            },
            mode: 'markers',
            name: 'map'
        }];
        
        this.setState({ tagCount: response_data.length });
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    
    render() {
        return (
            <div>
                <div className="admin-page-header">REAL-TIME USERS LOCATION</div>
                <div className="tag-count">Tags Detected: {this.state.tagCount}</div>
                {/* <span>Close Contact Detected: {this.state.CloseContactCount}</span> */}
                <Plot className="map"
                    data={this.state.json.data}
                    layout={this.state.json.layout}
                />
            </div>
        )
    }
}
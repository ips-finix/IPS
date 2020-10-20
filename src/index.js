import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './fonts/Overpass/Overpass-Regular.ttf'

if('serviceWorker' in navigator) { 
  navigator.serviceWorker.register('../firebase-messaging-sw.js')
    .then(function(registration) {
      console.log("Service Worker Registered");
      messaging.useServiceWorker(registration);  
    }); 
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

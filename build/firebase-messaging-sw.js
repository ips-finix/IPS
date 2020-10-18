importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyBkZf05R9DAitvRnuj7aWNS3FdZp0CWObQ",
  authDomain: "ips-fcm.firebaseapp.com",
  databaseURL: "https://ips-fcm.firebaseio.com",
  projectId: "ips-fcm",
  storageBucket: "ips-fcm.appspot.com",
  messagingSenderId: "580547664800",
  appId: "1:580547664800:web:f517b43ddbb91d4f0462c5",
  measurementId: "G-7ZCV6S3SDT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging.usePublicVapidKey("BJmWd5_Kc9P96xY9vmL6q3bogt041AO7d2Jws6llbxV5FTLAKEcfgHHaVfrfZYNHf-_AWEQp932R8TT0D3YrzTU");



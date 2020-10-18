import * as firebase from "firebase/app";
import "firebase/messaging";

let firebaseConfig = {
  apiKey: "AIzaSyBkZf05R9DAitvRnuj7aWNS3FdZp0CWObQ",
  appId: "1:580547664800:web:f517b43ddbb91d4f0462c5",
  messagingSenderId: "580547664800",
  projectId: "ips-fcm",
};

const initializedFirebase = firebase.initializeApp(firebaseConfig);
const messaging = initializedFirebase.messaging();
messaging.usePublicVapidKey("BJmWd5_Kc9P96xY9vmL6q3bogt041AO7d2Jws6llbxV5FTLAKEcfgHHaVfrfZYNHf-_AWEQp932R8TT0D3YrzTU");

export { messaging };

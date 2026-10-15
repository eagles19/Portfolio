/* =========================================================================
   FIREBASE SETUP
   -------------------------------------------------------------------------
   This uses Firebase's "compat" build (plain <script> tags in index.html,
   no ES module imports) specifically so the site still works when you
   just double-click index.html — no local server required.

   Collections this site uses (created automatically on first write):
     - contact_messages   { name, email, message, createdAt }
     - guestbook          { name, message, createdAt }
     - stats/visits       { count }   (single doc, incremented on load)

   Example Firestore rules (adjust to taste, add before going public):
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /contact_messages/{doc} { allow create: if true; allow read: if false; }
         match /guestbook/{doc}        { allow create: if true; allow read: if true; }
         match /stats/{doc}            { allow get, update: if true; allow create: if false; }
       }
     }
   ========================================================================= */
const firebaseConfig = {
  apiKey: "AIzaSyAnqta0uE4fjx640ukYZUWWAU8-i-qBGPo",
  authDomain: "my-portfolio-web-13b58.firebaseapp.com",
  projectId: "my-portfolio-web-13b58",
  storageBucket: "my-portfolio-web-13b58.firebasestorage.app",
  messagingSenderId: "697282071242",
  appId: "1:697282071242:web:9a77352e762ed1d5064233"
};

let db = null;
let firebaseReady = false;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  firebaseReady = firebaseConfig.apiKey !== "TODO_API_KEY";
} catch (e) {
  console.warn("Firebase not configured yet:", e);
}
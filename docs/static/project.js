import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection , doc, setDoc, getDocs, getDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { GoogleAuthProvider , getAuth, signInWithPopup, signOut, setPersistence, browserSessionPersistence} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCT_txTnewyhH8VFFNO5jgHvxyerbIzhk4",
  authDomain: "astro-website-48956.firebaseapp.com",
  projectId: "astro-website-48956",
  storageBucket: "astro-website-48956.firebasestorage.app",
  messagingSenderId: "1026726115415",
  appId: "1:1026726115415:web:320cb60bf7dfddc5950b12",
  measurementId: "G-60CE35ZVV8"
};

const client = new window.Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67777691001b45d492b8');

const storage = new window.Appwrite.Storage(client);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Persistence set successfully
    console.log("working");
  })
  .catch((error) => {
    // Error setting persistence
    console.error("Error setting persistence:", error);
  });

let controller = new AbortController();

const homePath = "../index.html";
const projectForm = document.getElementById("project-form");
const psave = document.getElementById("project-save");
const pcancel = document.getElementById("project-cancel");

psave.addEventListener('click',async (event)=>{
    event.preventDefault();
    controller.abort();
    controller = new AbortController();
    const signal = controller.signal;

    const title = document.getElementById('project-title').value;
    const des = document.getElementById('project-des').value;
    const imgFirst = document.getElementById('img-first').value;
    const projectImg = document.getElementById('project-img').files[0];
    if(!(title && des && imgFirst && projectImg)){
        alert("All fields must be filled!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    try{
        console.log("Form extracted succesfully");
    }
    catch(e){
        console.log("Error in Database :", e);
    }

});

pcancel.addEventListener('click',(event)=>{
    controller.abort();
    projectForm.reset();
    window.location.href = homePath;
});
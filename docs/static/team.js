import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCT_txTnewyhH8VFFNO5jgHvxyerbIzhk4",
  authDomain: "astro-website-48956.firebaseapp.com",
  projectId: "astro-website-48956",
  storageBucket: "astro-website-48956.firebasestorage.app",
  messagingSenderId: "1026726115415",
  appId: "1:1026726115415:web:320cb60bf7dfddc5950b12",
  measurementId: "G-60CE35ZVV8",
};

const client = new window.Appwrite.Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67777691001b45d492b8");

const storage = new window.Appwrite.Storage(client);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const adminRef = doc(db, "admin", "users");
const admin = await getDoc(adminRef);
const users = admin.data();

auth.onAuthStateChanged((user) => {
  if (user) {
    let allowed = 0;
    for (let ukey in users) {
      if (user.uid == users[ukey]) {
        allowed = 1;
      }
    }
    if (!allowed) {
      window.alert("Error 401 : unauthorized");
      window.location.href = "../index.html";
    }
  } else {
    window.alert("Error 401 : unauthorized");
    window.location.href = "../index.html";
  }
});

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
let tcount = 0;
extractProject();

const homePath = "../index.html";
const teamForm = document.getElementById("team-form");
const teamSave = document.getElementById("team-save");
const teamCancel = document.getElementById("team-cancel");

teamSave.addEventListener("click", async (event) => {
  event.preventDefault();
  controller.abort();
  controller = new AbortController();
  const signal = controller.signal;

  const name = document.getElementById("team-form").value;
  const designation = document.getElementById("team-des").value;
  const photo = document.getElementById("img-first").files[0];
  const year = document.getElementById("team-year").value;
  if (!(name && designation && photo && year)) {
    alert("All fields must be filled!");
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  try {
    //adding to appwrite
    const promise = storage.createFile(
      "67840116003980398e18",
      `project-${tcount + 1}`,
      photo
    );
    promise.then(
      function (res) {
        console.log("Image added to bucket");
      },
      function (error) {
        console.log(error);
      }
    );

    //adding to firebase
    await setDoc(
      doc(db, "teams", `project-${tcount + 1}`),
      {
        name: name,
        designation: designation,
        year: year,
      },
      { signal }
    );
    console.log("Team submitted");
    setTimeout(() => {
      teamForm.reset();
      window.location.href = "../index.html";
    });
  } catch (e) {
    console.log("Error in Database :", e);
  }
});

teamCancel.addEventListener("click", (event) => {
  controller.abort();
  projectForm.reset();
  window.location.href = homePath;
});

async function extractProject() {
  tcount = 0;
  const snap = await getDocs(collection(db, "teams"));
  snap.forEach((teams) => {
    tcount++;
  });
}

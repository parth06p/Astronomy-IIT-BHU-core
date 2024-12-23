import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection , doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {getStorage, ref, uploadBytes} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyB6D6or0h0tvZMrYiGQ6dIhOk4u21-EKbw",
  authDomain: "astro-iit.firebaseapp.com",
  projectId: "astro-iit",
  storageBucket: "astro-iit.firebasestorage.app",
  messagingSenderId: "156365410266",
  appId: "1:156365410266:web:02809445d3c6dd39667ae3"
};

//!!important TO DO
//secure the database after testing
//add sign in
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let data = [];
const blogForm = document.getElementById("blog-form");
const home = document.getElementById('home');
const blogCancel = document.getElementById('blog-cancel');
const addBlog = document.getElementById('add-blog');
const status = document.getElementById('status');
const upl_img = document.getElementById('upl-img');

loadBlog();

const img_input = document.getElementById('blog-image');
img_input.addEventListener('change', (event)=>{
  const upl = event.target.files[0];
  if(upl){
    let objURL = URL.createObjectURL(img_input.files[0]);
    upl_img.src = objURL;
    upl_img.style.display='block';
    upl_img.onload = ()=>{
      URL.revokeObjectURL(objURL);
    }}
});
blogForm.addEventListener("submit", async function(event){
    event.preventDefault();
    const val = document.getElementById("blog-content").value;
    const title = document.getElementById("blog-title").value;
    const blog_img = document.getElementById('blog-image').files[0];
    data = [title,val]; 
    try{
        status.style.display='block';
        //adding image to storage
        //creating reference to storage
        const imgRef = ref(storage, `blog-images/${blog_img.name}`);
        //uploading bytes
        const snapshot = await uploadBytes(imgRef, blog_img);
        const imgURL = await 
        //adding article to database
        await setDoc(doc(db, "blogs", "welcome-blog"), {
          title : data[0],
          content : data[1],
          image_url:imgURL
        });
        console.log("Added");
        status.style.animation = 'none';
        status.innerHTML='✅';
        setTimeout(() => {
          upl_img.style.display='none';
          blogForm.style.display = 'none';
          home.style.display = 'flex';
          addBlog.style.display = 'block';
          status.style.display='none';
          blogForm.reset();
        },500);
        loadBlog();
        
    }catch(e){
        console.error(e);
    }
});


blogCancel.addEventListener('click', ()=>{
  blogForm.style.display = 'none';
  home.style.display = 'flex';
  addBlog.style.display = 'block';
});

addBlog.addEventListener('click', ()=>{
  status.innerHTML='⭐';
  status.style.animation = `spin 1s linear infinite`;
  blogForm.style.display = 'flex';
  home.style.display = 'none';
  addBlog.style.display = 'none';
});

async function loadBlog(){
  //load blogs
  const blogid = "welcome-blog"
  const docRef = doc(db, "blogs", blogid);
  const sn = await getDoc(docRef);
  if(sn.exists()){
    //to remove later
    console.log("Data in DB :", sn.data());
    displayBlog(sn.data());
    
  }else{
    console.log("Blog not found :", blogid);
  }

}

function displayBlog(data){
  const content = data.content;
  const title = data.title;
  const blogData = content.split("\n");
  console.log("blog data:", blogData);
}




/*
EXTRA KNOWLEDGE : 

uploadBytes(storageRef, bytes).then((snapshot) => {
  console.log('Uploaded an array!');
  console.log('Bytes transferred:', snapshot.bytesTransferred);
  console.log('Total bytes:', snapshot.totalBytes);
  console.log('File uploaded to:', snapshot.ref.fullPath);
  console.log('Metadata:', snapshot.metadata);
});


let objURL = URL.createObjectURL(blog_img);
const head = document.getElementById('header');
head.innerHTML='';
const a = document.createElement('a');
a.href = objURL;
a.download = "uploaded-file.png"
a.innerHTML="download";
head.appendChild(a);
head.onload = () => { URL.revokeObjectURL(objURL);}

*/
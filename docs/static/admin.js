import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection , doc, setDoc, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyCT_txTnewyhH8VFFNO5jgHvxyerbIzhk4",
  authDomain: "astro-website-48956.firebaseapp.com",
  projectId: "astro-website-48956",
  storageBucket: "astro-website-48956.firebasestorage.app",
  messagingSenderId: "1026726115415",
  appId: "1:1026726115415:web:320cb60bf7dfddc5950b12",
  measurementId: "G-60CE35ZVV8"
};
//!!important TO DO
//secure the database after testing
//add sign in

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

let data = [];
let controller = new AbortController();
let blog_count = 0;
let addingBlog = false;

const blogForm = document.getElementById("blog-form");
const blogSave = document.getElementById("blog-save");
const home = document.getElementById('home');
const blogCancel = document.getElementById('blog-cancel');
const addBlog = document.getElementById('add-blog');
const status = document.getElementById('status');
const upl_img = document.getElementById('upl-img');
const loader = document.getElementById('loader-animation');
const active_blog = document.getElementById('active-blog');
const header = document.getElementById('header-text');


loadBlogs();

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
blogSave.addEventListener("click", async function(event){
    event.preventDefault();
    controller.abort();
    controller = new AbortController();
    const signal = controller.signal;

    const val = document.getElementById("blog-content").value;
    const title = document.getElementById("blog-title").value;
    const blog_img = document.getElementById('blog-image').files[0];

    data = [title,val]; 
    try{
        status.style.display='block';
        console.log(blog_count);
        /*//adding image to storage
        //creating reference to storage
        const imgRef = ref(storage, `blog-images/blog-${blog_count+1}.jpg`);
        //uploading bytes
        const snapshot = await uploadBytes(imgRef, blog_img);
        const imgURL = await getDownloadURL(snapshot.ref);
        console.log("Image URL :", imgURL);
        */
        //adding article to database
        await setDoc(doc(db, "blogs", `blog-${blog_count+1}`), {
          title : data[0],
          content : data[1],
        }, {signal});
        console.log("Added");
        status.style.animation = 'none';
        status.innerHTML='✅';
        setTimeout(() => {
          addingBlog = false;
          upl_img.style.display='none';
          blogForm.style.display = 'none';
          home.style.display = 'flex';
          addBlog.style.display = 'block';
          status.style.display='none';
          blogForm.reset();
        },500);
        loadBlogs();
        
    }catch(e){
        console.error(e);
    }
});


blogCancel.addEventListener('click', ()=>{
  controller.abort();
  blogForm.reset();
  addingBlog = false;
  header.textContent = "Welcome to Astronomy Club Blogger";
  console.log("upload cancelled");
  blogForm.style.display = 'none';
  home.style.display = 'flex';
  addBlog.style.display = 'block';
  loadBlogs();
});

addBlog.addEventListener('click', ()=>{
  status.innerHTML='';
  header.textContent = "New post";
  addingBlog = true;
  active_blog.style.display = 'none';
  loader.style.display = 'none';
  status.style.animation = `spin 1s linear infinite`;
  blogForm.style.display = 'flex';
  home.style.display = 'none';
  addBlog.style.display = 'none';
});


async function loadBlogs(){
  blog_count = 0;
  const home = document.getElementById('home');
  home.innerHTML="";
  //load blogs
  active_blog.style.display = 'block';
  loader.style.display = 'block';
  const sn = await getDocs(collection(db, "blogs"));
  sn.forEach((doc) => {
    blog_count++;
    displayBlog(doc.data(), blog_count);
  });
  loader.style.display = 'none';
}

function displayBlog(data, count){
  //display each block
  const content = data.content;
  const blogTitle = data.title;
  const blogData = content.split("\n");
  const home = document.getElementById('home');

  const blogdp = document.createElement('div');
  blogdp.id = `blog-${count}`;
  blogdp.classList.add('blog-dp');
  
  const titlediv = document.createElement('div');
  titlediv.textContent = blogTitle;
  titlediv.classList.add('title');

  const hrelement = document.createElement('hr');
  titlediv.appendChild(hrelement);

  const contentdiv = document.createElement('div');
  contentdiv.classList.add('content');

  for(let i = 0; i<blogData.length; i++){
    const para = document.createElement('p');
    para.innerHTML = blogData[i];
    contentdiv.appendChild(para);
  }

  blogdp.appendChild(titlediv);
  blogdp.append(contentdiv);
  home.appendChild(blogdp);
}

window.addEventListener('scroll',function(){
  if(!addingBlog){
    const sections = document.querySelectorAll('.blog-dp');
    let curTitle = "Welcome to Astronomy Club Blogger";
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 0 && rect.bottom >= 0) {
          const sectionTitle = section.querySelector('.title').textContent;
          curTitle = sectionTitle;
      }
    });
    header.textContent = curTitle;
  }else{
    header.textContent = "New Post";
  }
});


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


//adding image to storage
//creating reference to storage
const imgRef = ref(storage, `blog-images/welcome-blog.jpg`);
//uploading bytes
const snapshot = await uploadBytes(imgRef, blog_img);
const imgURL = await getDownloadURL(snapshot.ref);
console.log("Image URL :", imgURL);
*/
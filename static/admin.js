import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection , doc, setDoc, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
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
let controller = new AbortController();
let blog_count = 0;

const blogForm = document.getElementById("blog-form");
const blogSave = document.getElementById("blog-save");
const home = document.getElementById('home');
const blogCancel = document.getElementById('blog-cancel');
const addBlog = document.getElementById('add-blog');
const status = document.getElementById('status');
const upl_img = document.getElementById('upl-img');

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
  loadBlogs();
  controller.abort();
  console.log("upload cancelled");
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

async function loadOnlyBlogs(){
  blog_count = 0;
  const sn = await getDocs(collection(db, "blogs"));
  sn.forEach((doc) => {
    blog_count++;
  });
}
async function loadBlogs(){
  blog_count = 0;
  const home = document.getElementById('home');
  home.innerHTML="";
  //load blogs
  const sn = await getDocs(collection(db, "blogs"));
  sn.forEach((doc) => {
    blog_count++;
    displayBlog(doc.data(), blog_count);
  });
}

function displayBlog(data, count){
  //display each block
  const content = data.content;
  const blogTitle = data.title;
  const blogData = content.split("\n");
  const home = document.getElementById('home');

  const blogdp = document.createElement('div');
  blogdp.id = `blog-${count+1}`;
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
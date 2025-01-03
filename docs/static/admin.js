import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getFirestore, collection , doc, setDoc, getDocs} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
//note that nextjs project is working with fierbase sdk not cdn
const firebaseConfig = {
  apiKey: "AIzaSyB6D6or0h0tvZMrYiGQ6dIhOk4u21-EKbw",
  authDomain: "astro-iit.firebaseapp.com",
  projectId: "astro-iit",
  storageBucket: "astro-iit.firebasestorage.app",
  messagingSenderId: "156365410266",
  appId: "1:156365410266:web:02809445d3c6dd39667ae3"
};


const client = new window.Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67777691001b45d492b8');

const storage = new window.Appwrite.Storage(client);

//!!important TO DO
//secure the database after testing
//add sign in

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
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
const loader = document.getElementById('loader-animation');
const active_blog = document.getElementById('active-blog');
const header = document.getElementById('header-text');


loadBlogs();

blogSave.addEventListener("click", async function(event){
    event.preventDefault();
    controller.abort();
    controller = new AbortController();
    const signal = controller.signal;

    const content = document.getElementById("blog-content").value;
    const title = document.getElementById("blog-title").value;
    const blog_img = document.getElementById('blog-image').files[0];
    const writer_img = document.getElementById('writer-image').files[0];
    const author = document.getElementById("blog-author").value;
    const slug = document.getElementById("blog-slug").value;
    const date = document.getElementById("blog-date").value;
    const cat = document.getElementById("blog-category").value;
    const heading = document.getElementById("blog-heading").value;
    const des = document.getElementById("blog-description").value;

    try{
        status.style.display='block';
        console.log("Blog count :",blog_count);
        //adding header image to appwrite storage
        const promise = storage.createFile(
          '677777dc00318c84924c',
          `blog-${blog_count+1}`,
          blog_img
        );
        promise.then(function (response) {
            console.log("check 1"); 
        }, function (error) {
            console.log(error);
        });

        //adding writer image to appwrite storage
        const pr = storage.createFile(
          '677777dc00318c84924c',
          `blog-${blog_count+1}-writer`,
          writer_img
        );
        pr.then(function (response) {
            console.log("check 2"); 
        }, function (error) {
            console.log(error);
        });
        //adding article to database
        await setDoc(doc(db, "blogs", `blog-${blog_count+1}`), {
          title : title,
          content : content,
          author: author,
          slug: slug,
          description: des,
          date: date,
          category: cat,
          heading:heading,
          content:content
        }, {signal});
        console.log("Added");
        status.style.animation = 'none';
        status.innerHTML='✅';
        setTimeout(() => {
          addingBlog = false;
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
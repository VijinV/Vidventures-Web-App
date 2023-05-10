const cloudinary = require('cloudinary').v2;


// Configuration 
cloudinary.config({
  cloud_name: "dhpo97gck",
  api_key: "454738439324684",
  api_secret: "GFnlAm7du8vtnosxYl1sc5v9WGM"
});


// Upload

const res = cloudinary.uploader.upload('./image_1681537385279.png', {public_id: "new"})

res.then((data) => {
  console.log(data);
  console.log(data.secure_url);
}).catch((err) => {
  console.log(err);
});


// Generate 
const url = cloudinary.url("new", {
  width: 100,
  height: 150,
  Crop: 'fill'
});



// The output url
console.log(url);
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
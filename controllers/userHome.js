const postModel = require("../models/postModel");
const reviewModel = require("../models/reviewModel");
const { IgApiClient } = require("instagram-private-api");
const ig = new IgApiClient();
const formModal = require("../models/formData");

const getSession = (req, res) => {
  return req.session.user_id;
};

let login = false;
let instPost = [];

// async function fetchInstagramPosts() {
//     // Login to Instagram
//     ig.state.generateDevice('sampkle');
//     await ig.account.login('sampkle', '@narsmaster31');

//     // Get user's media
//     const user = await ig.user.searchExact('sampkle');
//     const userFeed = ig.feed.user(user.pk);
//     const mediaList = await userFeed.items();

//     // console.log(mediaList);

//     // Log the media URLs
//     for (const media of mediaList) {
//     //   console.log(media.image_versions2.candidates[0].url);
//     //   console.log(`Description: ${media.caption.text}`)
//     const imageUrl = `https://cors-anywhere.herokuapp.com/${media.image_versions2.candidates[0].url}`;

//       const post = {
//         image:imageUrl,
//         description:media.caption.text
//       }

//       instPost.push(post)

//     }

//   }

//   fetchInstagramPosts()

const loadHome = async (req, res, next) => {
  const review = await reviewModel.find({}).limit(9)
  const sorted = await reviewModel.find({}).sort({_id:-1}).limit(9)


  const post = await postModel.findOne({
    isAvailable: true,
    postType: "Blog"
  }).sort({ _id: -1 });
  

  const posts = await postModel
  .find({ isAvailable: true, postType: "Blog" })
  .sort({ _id: -1 })
  .skip(1)
  .limit(3);

  setTimeout(()=>{
    res.render("home", {
      login,
      session: getSession(req, res),
      review: review,
      post,
      posts,
      sorted
    } )
  },3000)

    // const Post = await postModel.find().then((res)=>console.log(res))
  
};

const formData = async (req, res) => {
  try {
    const { name, form_data, form_data_one, email } = req.body;
  
    const form = new formModal({
      name,
      form_data,
      form_data_one,
      email,
    });
    await form.save();
  
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting form" });
  }

};

module.exports = {
  loadHome,
  formData
};

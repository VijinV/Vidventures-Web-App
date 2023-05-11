const postModel = require("../models/postModel");
const reviewModel = require("../models/reviewModel");
const { IgApiClient } = require('instagram-private-api');
const ig = new IgApiClient();


const getSession = (req, res) => {
    return req.session.user_id;
  };

  let login = false;
let instPost = []

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

    const review = await reviewModel.find({});

    const post = await postModel.find({isAvailable:true}).sort({_id:-1}).limit(1)

    const posts = await postModel.find({isAvailable:true}).skip(1).sort({_id:-1}).limit(3)
    res.render("home", { login, session: getSession(req, res), review: review ,post,posts});
  };


  module.exports = {
    loadHome,
  }
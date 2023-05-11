// const Instagram = require('instagram-web-api')
require('dotenv').config()
const username = process.env.INSTA_ID
const password = process.env.INSTA_PASS
const email = process.env.INSTA_EMAIL

const Instagram = require('instagram-private-api');


// const client = new Instagram({ email, password })

// console.log(username)

// client
//   .login()
//   .then(() => {
//     client
//       .getProfile()
//       .then(console.log)
//   })


//   const fetch = async () => {
//     const profile = await client.getProfile()
   
//     console.log(profile)
//   }

// //    (async () => {
// //     await client.login()
// //     const profile = await client.getProfile()
   
// //     console.log(profile)
// //   })()

// fetch()




// const { IgApiClient } = require('instagram-private-api');

// // Create a new instance of the Instagram API client
// const ig = new IgApiClient();

// // Initialize the client with your Instagram account credentials
// const fetchPosts = async (email, password) => {
//   ig.state.generateDevice(email);
//   await ig.account.login(email, password);
//   const posts = await ig.feed.user().items();
//   console.log(posts);
// }

// // Call the fetchPosts function with your Instagram account credentials
// fetchPosts(username, password);

const { IgApiClient } = require('instagram-private-api');

const ig = new IgApiClient();
ig.state.generateDevice(username); // replace 'your_username' with your actual Instagram username
ig.account.login(username,password ).then(() => {
  return ig.user.searchExact('master00177');
}).then(user => {
  return ig.feed.user(user.pk).items();
}).then(posts => {
  const formattedPosts = posts.map(post => {
    let image = null;
    if (post.imageVersions2 && post.imageVersions2.candidates.length > 0) {
      image = post.imageVersions2.candidates[0].url;
    }
    return {
      image: image,
      description: post.caption ? post.caption.text : null
    };
  });
  console.log(formattedPosts);
}).catch(error => {
  console.error(error);
});

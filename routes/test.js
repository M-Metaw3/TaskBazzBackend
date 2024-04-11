// const  express = require('express');
// const router = express.Router();
// const createMulterUpload= require('../utils/multer');


// // Create multer upload middleware with custom file path
// const productImageUpload = createMulterUpload('images/products/');

// // Define the route for uploading product images
// router.post('/', productImageUpload.single('productImage'), (req, res) => {
//     console.log(req.file)
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   // Handle the uploaded file here (e.g., save file path to database, return response, etc.)
//   const filePath = req.file.path;
//   res.status(200).json({ success: true, filePath });
// });

// module.exports = router;










const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect user to Google authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback
// router.get('/auth/google/callback', passport.authenticate('google', {
//   successRedirect: '/', // Redirect on successful authentication
//   failureRedirect: '/login' // Redirect on failure
// }));

module.exports = router;

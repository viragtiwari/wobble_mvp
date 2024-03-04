const mongoose = require('mongoose');
require('dotenv').config();

// Use the environment variable for the MongoDB URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Database Connected Successfully");
})
.catch((err) => {
  console.log("Database cannot be Connected:", err);
});

// Define Schema
const Loginschema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true
  
  },
  name : {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
 profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
 }
});

// Create Model for 'user' collection
const User = mongoose.model("User", Loginschema);

module.exports = User;

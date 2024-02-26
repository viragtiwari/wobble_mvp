const mongoose = require('mongoose');

// Updated Connection URI for MongoDB Atlas with the database name
const uri = "mongodb+srv://viragtiwari200424:fu9q78LrIXlNYmyY@cluster0.ymhphrx.mongodb.net/wobble_data?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
const connect = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check database connected or not
connect.then(() => {
  console.log("Database Connected Successfully");
}).catch((err) => {
  console.log("Database cannot be Connected:", err);
});

// Define Schema
const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create Model for 'user' collection
const collection = mongoose.model("user", Loginschema);

module.exports = collection;

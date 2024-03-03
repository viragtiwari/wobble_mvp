const express = require("express");
const session = require("express-session");
require("./config");
const authRoutes = require('../routes/authRoutes');
const app = express();
const path = require('path'); // Add path module for resolving file paths

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'A very secret key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // For development; in production set to true if using HTTPS
}));

// Routes
app.use(authRoutes);

// Serve pg1.html as the root page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/pg1.html'));
});

// Define Port for Application
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const express = require("express");
const path = require("path");
const User = require('./config');
const bcrypt = require('bcrypt');
const app = express();

// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, './public/frontpage.html'));
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Register User
// Register User
app.post("/signup", async (req, res) => {
    try {
        const data = {
            user_name: req.body.username,
            name     : req.body.name,
            password : req.body.password
        };

        // Check if the username already exists in the database
        const existingUser = await User.findOne({ name: data.name });
        if (existingUser) {
            return res.status(409).send('User already exists. Please choose a different username.');
        } else {
            // If the username doesn't exist, create a new user
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password = hashedPassword;

            // Create a new user document using the User model
            await User.create(data);

            // Redirect the user to the login page after successful signup
            return res.redirect("/w/login");
        }
    } catch (error) {
        // Handle errors
        console.error("Error during signup:", error);
        return res.status(500).send("An unexpected error occurred. Please try again later.");
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ user_name: req.body.username });
        if (!check) {
            return res.send("User name cannot found");
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("wrong Password");
        }
        // If login is successful, redirect to the profile page
        return res.redirect("/profile");
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send("An unexpected error occurred");
    }
});


// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
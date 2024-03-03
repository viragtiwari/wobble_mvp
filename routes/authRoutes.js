const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../src/config'); // Assuming User model is exported from config.js
const router = express.Router();


router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/profile", (req, res) => {
    res.render("profile");
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login'); // Assuming you have a route prefix '/w'
    }
}

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, name, password } = req.body;
        const existingUser = await User.findOne({ user_name: username });
        if (existingUser) {
            res.status(409).render('signupfail'); // Render a signup failure page
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                user_name: username,
                name: name,
                password: hashedPassword
            });
            await newUser.save();
            req.session.userId = newUser._id;
            res.redirect('/dashboard'); // Redirect to dashboard
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).render('signupfail'); // Render a signup failure page
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ user_name: req.body.username });
        if (!user) {
            res.render('login', { message: "User name cannot found" });
        } else if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            res.redirect('/profile'); // Redirect to profile page
        } else {
            res.render('login', { message: "Wrong Password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).render('login', { message: "An unexpected error occurred" });
    }
});

// Logout Route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login
    });
});

// Protected Dashboard Route
router.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('dashboard'); // Render the dashboard view
});

module.exports = router;

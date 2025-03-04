const express = require("express");
const { ValidateSignup } = require("../utils/validationSignup");
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user")

authRouter.post("/signup", async (req, res) => {
    try {
        ValidateSignup(req);
        const { firstName, lastName, email, password, PhotoUrl, skills, phoneNumber, gendor } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const userData = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            PhotoUrl,
            skills, phoneNumber, gendor
        });

        const user = await userData.save();
        const token = await user.getJWT();
        res.cookie("token", token,);
        return res.json({ data: user });

        res.status(201).send("Signup successful");
    } catch (error) {
        res.status(400).send(`Signup unsuccessful: ${error.message}`);
    }
});



authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid login credentials" });
        }

        const token = await user.getJWT();
        res.cookie("token", token,);

        return res.json({ data: user });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
});


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    })
    res.send("logout succesfully")
})


module.exports = authRouter
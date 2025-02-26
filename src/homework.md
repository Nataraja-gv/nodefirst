const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user")
const { ValidateSignup } = require("./utils/validationSignup");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const { userAuth } = require("./middleware/index")

const app = express();

app.use(express.json());
app.use(cookieParser())
 

app.post("/signup", async (req, res) => {

    try {
        ValidateSignup(req);
        const { firstName, lastName, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const userData = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await userData.save();
        res.status(201).send("Signup successful");
    } catch (error) {
        res.status(400).send(`Signup unsuccessful: ${error.message}`);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("Invalid login credentials");
        }
        const isPasswordValid = await  user.validatePassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT()
            res.cookie("token", token)
            res.send("Login successful");
        }
        else {
            return res.status(401).send("Invalid login credentials");
        }


    } catch (error) {
        res.status(500).send(`Login unsuccessful: ${error.message}`);
    }
});

app.get("/profile", userAuth, async (req, res) => {

    try {
        const user = req.user


        if (user) {
            res.send(user)
        }
    }
    catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }



})

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    res.send("connection request" + user.firstName)
})


 

app.put("/updateData/:_id", async (req, res) => {
    const id = req.params._id;
    const data = req.body;
    try {
        const UPDATE_ALLOWED = [
            "firstName",
            "lastName",
            "age",
            "password",
            "PhotoUrl",
            "gendor",
            "phoneNumber",
            "skills"
        ]

        const isValisUpdated = Object.keys(data).filter((key) => !UPDATE_ALLOWED.includes(key))
        if (isValisUpdated) {
            throw new Error("update field not in list" + isValisUpdated.join(","))
        }

        const result = await User.findByIdAndUpdate(id, data, { runValidators: true, returnDocument: "after" })
        res.send(result)
    }
    catch (error) {
        res.status(400).send("ERROR:" + error.message)
    }
})


connectDB().then(() => {
    console.log("mongoodb connected successfully")
    app.listen(1010, () => {
        console.log("server  connected successfully")
    })
})
    .catch((err) => {
        console.log("ERROR:" + err.message)
    })

const express = require("express");
const { userAuth } = require("../middleware/index")
const { ValidProfileData } = require("../utils/validationSignup")
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {

    try {
        const user = req.user


        if (user) {
            res.send(user)
        }
    }
    catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }



});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        if (!ValidProfileData(req)) {
            throw new Error("invalid edit field")
        }
        const isAllowdData = req.user;

        Object.keys(req.body).forEach((key) => (isAllowdData[key] = req.body[key]))
        await isAllowdData.save()

        res.send(isAllowdData.firstName + "profile update succesfully")

    } catch (error) {
        res.status(500).send(` Error: ${error.message}`);
    }

});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {

        const { oldPassWord, newPassword } = req.body;
        if (!oldPassWord || !newPassword) {
            return res.status(400).json({ message: "Old and New passwords are required." });
        }

        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const validPassword = await bcrypt.compare(oldPassWord, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: " in valid old password" })
        }

        const newPasswordHash = await bcrypt.hash(newPassword, 10)
        user.password = newPasswordHash;
        await user.save();

        res.status(200).send("password  updated sucessfully!!!")


    }
    catch (error) {
        res.status(500).json({ message: `Error: ${error.message}` });
    }

})


// profileRouter.patch("/profile/password", userAuth, async (req, res) => {
//     try {
//         const { oldPassWord, newPassword } = req.body;
//         if (!oldPassWord || !newPassword) {
//             return res.status(400).json({ message: "Old and New passwords are required." });
//         }

//         const user = req.user;
//         if (!user) {
//             return res.status(404).json({ message: "User not found." });
//         }
//         const isPasswordValid = await user.validatePassword(oldPassWord);
//         if (!isPasswordValid) {
//             return res.status(400).json({ message: "incorrect old password" })
//         }

//         const newPasswordHash = await bcrypt.hash(newPassword, 10);
//         user.password = newPasswordHash;
//         await user.save()
//         res.json({ message: "Password updated successfully." });

//     }
//     catch (error) {
//         res.status(500).json({ message: `Error: ${error.message}` });
//     }
// })




module.exports = profileRouter
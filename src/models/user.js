
const mongoose = require("mongoose");
const validate = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validate.isEmail(value)) {
                throw new Error("email in  valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validate.isStrongPassword(value)) {
                throw new Error("password make strong")
            }
        }
    },
    PhotoUrl: {
        type: String,
        validate(value) {
            if (!validate.isURL(value)) {
                throw new Error(" photo url is not valid")
            }
        }
    },
    gendor: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("gender not valid!!!")
            }
        }
    },
    phoneNumber: {
        type: Number,


    },
    age: {
        type: String
    },
    skills: {
        type: [String]
    }


}, { timestamps: true })

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "dev@Tinder123", { expiresIn: "1d" })

    return token
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;

    const validPassword = await bcrypt.compare(password, user.password);
    return validPassword
}

const User = mongoose.model("users", userSchema);

module.exports = User;
const validate = require("validator");


const ValidateSignup = (req) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("name is not valid");

    }

    else if (!validate.isEmail(email)) {
        throw new Error("email in valid")
    }

    else if (!validate.isStrongPassword(password)) {
        throw new Error("password make string")
    }
}


const ValidProfileData = (req) => {
    const AllowedEditProfileData = ["firstName", "lastName", "skills", "age","gendor","PhotoUrl"];
    const isEditAllowed = Object.keys(req.body).every((field) => AllowedEditProfileData.includes(field))
    return isEditAllowed;
}
 

module.exports = { ValidateSignup, ValidProfileData };
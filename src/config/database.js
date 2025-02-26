const mongoose = require("mongoose");

const connectDB = async ()=>{
    await  mongoose.connect('mongodb+srv://natarajagv2025:FTJ27vaMFs4zbWt6@namstenodejs.1eo8q.mongodb.net/devTinder');

}

module.exports=connectDB;
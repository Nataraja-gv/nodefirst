const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profile")
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
const cors = require('cors');
const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser())


app.use("/", profileRouter);
app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", userRouter);





connectDB().then(() => {
    console.log("mongoodb connected successfully")
    app.listen(1010, () => {
        console.log("server  connected successfully")
    })
})
    .catch((err) => {
        console.log("ERROR:" + err.message)
    })

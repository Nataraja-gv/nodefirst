const express = require("express");
const { userAuth } = require("../middleware");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "age", "phoneNumber", "skills"]

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName")

        res.json({
            message: "Data fetch Successfully",
            data: connectionRequest
        })

    }
    catch (error) {
        res.status(400).send({ message: "ERROR :" + error.message })
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if (row.fromUserId.toString() === loggedInUser.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({
            data: data
        })


    }
    catch (error) {
        res.json({ message: error.message })
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page || 1);
        let limit = parseInt(req.query.limit || 10)
        limit=limit>50?50:limit;
         
        const skip = (page-1)*limit

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());


        })
        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]

        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.send(user)

    }
    catch (error) {
        res.status(400).json({ message: "ERROR :" + error.message })
    }
})


module.exports = userRouter;
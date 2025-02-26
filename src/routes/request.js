const express = require("express");
const { userAuth } = require("../middleware/index");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            return res.send({ message: "status invalid" })
        }

        const toUser = await User.findById(toUserId)

        if (!toUser) {
            return res.status(400).send({ message: "User not found" })

        }


        const existingconnectionRequest = await ConnectionRequestModel.findOne({
            $or: [{ toUserId, fromUserId }, {
                toUserId: fromUserId, fromUserId: toUserId
            }

            ]
        })

        if (existingconnectionRequest) {
            return res.send({ message: "request already exist" })
        }


        const connectionRequestData = await ConnectionRequestModel({
            fromUserId, toUserId, status
        });


        const data = await connectionRequestData.save();

        res.json({
            message: "connection request succesfully!!",
            data
        })




    }
    catch (error) {
        res.status(400).send("ERROR :" + error.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggeduser = req.user;
        console.log(loggeduser._id, "loggeduser")
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "invalid status request" })
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            toUserId: loggeduser._id,
            _id: requestId,
            status: "interested"
        }) 

        if (!connectionRequest) {
            return res.status(400)?.json({ message: " invalid conntion request" })
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({ message: "request accepted successfully!!" + status, data })

    }
    catch (error) {
        res.status(400).send("ERROR :" + error?.message);
    }
})


module.exports = requestRouter





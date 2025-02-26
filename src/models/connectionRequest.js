const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true

    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: 'value incorrect type'
        }
    }
},
    {
        timestamps: true
    })

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error(" canot send request yourself")
    }
    next()
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
import mongoose from "mongoose";

export default new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    }
});

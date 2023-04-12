import mongoose from "mongoose";

export default new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    hosts: {
        type: Array<String>,
    },
    publishedDate: {
        type: Date,
        required: true,
    }
});

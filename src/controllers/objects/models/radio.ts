import mongoose from "mongoose";

type Live = {
    uid: string,
    title: string,
    type: string,
    URL: string,
}

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
    live: {
        type: Array<Live>,
        required: true,
    }
});

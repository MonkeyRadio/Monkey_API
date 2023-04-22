import mongoose from "mongoose";

export type User = {
    uid: string,
    name: string,
    icon: string,
    email: string,
    password: string,
    permissions: Array<string> | undefined
}

const schema =  new mongoose.Schema<User>({
    uid: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        indexes: true,
    },
    icon: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        indexes: true,
    },
    password: {
        type: String,
        required: true,
    },
    permissions: {
        type: Array<string>,
        required: true,
    }
});

export default mongoose.model<User>("User", schema);

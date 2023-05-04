import mongoose from "mongoose";

export type User = {
    slug: string,
    name: string,
    icon: string,
    email: string,
    password: string,
    permissions: Array<string> | undefined
}

const schema =  new mongoose.Schema<User>({
    slug: {
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
        required: false,
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

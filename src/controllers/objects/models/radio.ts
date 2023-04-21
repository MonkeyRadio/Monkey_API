import mongoose from "mongoose";

export type Live = {
    uid: string,
    title: string,
    description: string
}

export type Radio = {
    slug: string,
    name: string,
    icon: string,
    live: Array<Live> | undefined
}

const schema = new mongoose.Schema<Radio>({
    slug: {
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

export default mongoose.model<Radio>("Radio", schema);

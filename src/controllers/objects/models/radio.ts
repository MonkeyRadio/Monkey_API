import mongoose from "mongoose";

export type Variant = {
    slug: string,
    name: string,
    icon: string
}

export type Radio = {
    slug: string,
    name: string,
    icon: string,
    variants: Array<Variant> | undefined
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
    variants: {
        type: Array<Variant>,
        required: true,
    }
});

export default mongoose.model<Radio>("Radio", schema);

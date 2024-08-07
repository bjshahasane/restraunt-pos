import mongoose, { Schema } from "mongoose";

// mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            required: false,
            default: "user"
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model('User',UserSchema);

export default User;
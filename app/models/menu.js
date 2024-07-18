import mongoose, { Schema } from "mongoose";

const MenuOptionsSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
}, { _id: false });


const MenuSchema = new Schema({
        id: {
            type: String,
            unique: true,
            required: true,
        },
        categoryName: {
            type: String,
            required: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        options: {
            type: [MenuOptionsSchema],
            required: false,  // Allow options array to be empty
            default: [],  // Default to an empty array
        },
    },
    {
        timestamps: true,  // Automatically manage createdAt and updatedAt properties
    }, 
    { _id: false }
);



const Menu = mongoose.models.menu || mongoose.model('menu', MenuSchema);

export default Menu;
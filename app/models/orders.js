import mongoose, { Schema } from "mongoose";

// mongoose.connect(process.env.MONGODB_URI);

const OrderItemSchema = new Schema({
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
    quantity: {
        type: Number,
        required: true,
    },
}, { _id: false });

const OrdersSchema = new Schema(
    {
        orderId: {
            type: Number,
            unique: true,
            required: true,
        },
        tableId: {
            type: String,
            required: true,
        },
        orders: {
            type: [OrderItemSchema],  // Use the defined OrderItemSchema
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        date: {
            type: Date,  // Use Date type for better date handling
            required: true,
        },
    },
    {
        timestamps: true,  // Automatically manage createdAt and updatedAt properties
    }, { _id: false }
);



const Orders = mongoose.models.orders || mongoose.model('orders', OrdersSchema);

export default Orders;
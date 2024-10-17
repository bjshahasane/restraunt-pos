import Orders from "@/app/models/orders";
import { NextResponse } from "next/server";
// import bcrypt from "bcrypt";
import connectMongoDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/libs/Authorization";

export async function POST(req) {
    try {

        try {
            const decodedToken = verifyToken(req); // If token is invalid, it will throw an error
            console.log("Token verified. User ID:", decodedToken.userId);  // Example use of decoded token
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
        }
        const body = await req.json();
        // const { orderId, tableId, orders, total, status, date } = body;

        await connectMongoDB();



        await Orders.create(body);
        console.log("This is formData", body);
        return NextResponse.json({ message: 'Order Created' }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'error', error }, { status: 500 })
    }
}

export async function PUT(req) {
    try {

        try {
            const decodedToken = verifyToken(req); // If token is invalid, it will throw an error
            console.log("Token verified. User ID:", decodedToken.userId);  // Example use of decoded token
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
        }

        // Extract order ID from query parameters
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');


        // Parse the request body for updated order data
        const body = await req.json();

        await connectMongoDB();

        const updateFields = {};
        if (orderId) {
            if (body.total !== undefined) updateFields.total = body.total;
            if (body.orders !== undefined) updateFields.orders = body.orders;
            if (body.date !== undefined) updateFields.date = body.date;
            if (body.status !== undefined) updateFields.status = body.status;
        }


        // if (orderId || status) {
        //     if (body.date !== undefined) updateFields.date = body.date;
        // }

        console.log("This is update", updateFields);
        // const ObjectId = new mongoose.Types.ObjectId(orderId);
        // Find the order by ID and update it with the new data

        // console.log("this is objectid",ObjectId);
        const updatedOrder = await Orders.findOneAndUpdate(
            { orderId: orderId },
            { $set: updateFields },
            { new: true, runValidators: true, omitUndefined: true },
        );

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        console.log("Order updated", updatedOrder);
        return NextResponse.json({ message: 'Order Updated', order: updatedOrder }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error updating order', error }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {

        try {
            const decodedToken = verifyToken(req); // If token is invalid, it will throw an error
            console.log("Token verified. User ID:", decodedToken.userId);  // Example use of decoded token
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
        }


        // Extract order ID from query parameters
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');
        console.log("This is search",orderId);

        await connectMongoDB();

        // Find the order by ID and delete it
        const deletedOrder = await Orders.findOneAndDelete({ orderId: orderId }); // Use an object to query by _id

        if (!deletedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        console.log("Order deleted", deletedOrder);
        return NextResponse.json({ message: 'Order Deleted' }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error deleting order', error }, { status: 500 });
    }
}
export async function GET(req) {
    try {
        const decodedToken = verifyToken(req);
        console.log("Token verified. User ID:", decodedToken.userId);

        await connectMongoDB();

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');
        const tableId = searchParams.get('tableId');
        const page = parseInt(searchParams.get('page')) || 1; // default to page 1
        const limit = parseInt(searchParams.get('limit')) || 10; // default limit for pagination
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; // ascending or descending
        const dateFilter = searchParams.get('dateFilter'); // New filter to get date-based sorting

        let query = {};
        if (orderId) query.orderId = orderId;
        if (tableId) query.tableId = tableId;

        // Calculate date ranges based on the selected filter
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
        const startOfWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0];
        const startOfPreviousWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay() - 7)).toISOString().split('T')[0];

        // Apply date filtering based on `dateFilter`
        if (dateFilter === 'today') {
            query.date = {
                $gte: new Date(`${today}T00:00:00.000Z`),
                $lt: new Date(`${today}T23:59:59.999Z`)
            };
        } else if (dateFilter === 'yesterday') {
            query.date = {
                $gte: new Date(`${yesterday}T00:00:00.000Z`),
                $lt: new Date(`${yesterday}T23:59:59.999Z`)
            };
        } else if (dateFilter === 'currentWeek') {
            query.date = {
                $gte: new Date(`${startOfWeek}T00:00:00.000Z`),
                $lt: new Date(`${today}T23:59:59.999Z`)
            };
        } else if (dateFilter === 'previousWeek') {
            query.date = {
                $gte: new Date(`${startOfPreviousWeek}T00:00:00.000Z`),
                $lt: new Date(`${startOfWeek}T00:00:00.000Z`)
            };
        }

        const skip = (page - 1) * limit;

        const orders = await Orders.find(query)
            .sort({ date: sortOrder }) // sort by date
            .skip(skip) // skip the previous pages
            .limit(limit); // limit the results

        const totalOrders = await Orders.countDocuments(query); // total number of orders for pagination

        return NextResponse.json({
            orders,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving orders', error }, { status: 500 });
    }
}

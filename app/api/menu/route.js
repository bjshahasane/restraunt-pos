import Menu from "@/app/models/menu";
import { NextResponse } from "next/server";
import connectMongoDB from "@/app/libs/mongodb";
import { verifyToken } from "@/app/libs/Authorization";

export async function GET(req) {
    try {

        try {
            const decodedToken = verifyToken(req); // If token is invalid, it will throw an error
            console.log("Token verified. User ID:", decodedToken.userId);  // Example use of decoded token
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
        }

        await connectMongoDB();

       
        // Find orders based on the query parameters
        const menu = await Menu.find();

        if (!menu.length) {
            return NextResponse.json({ message: 'No menu found' }, { status: 404 });
        }

        // console.log("Orders retrieved", orders);
        return NextResponse.json({ menu }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving menu', error }, { status: 500 });
    }
}

export async function POST(req) {
    try {

        try {
            const decodedToken = verifyToken(req); // If token is invalid, it will throw an error
            console.log("Token verified. User ID:", decodedToken.userId);  // Example use of decoded token
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
        }
        
        const body = await req.json();

        await connectMongoDB();

       

        await Menu.create(body);
        console.log("This is formData", body);
        return NextResponse.json({ message: 'Menu Created' }, { status: 200 });

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

        const { searchParams } = new URL(req.url);
        const menuId = searchParams.get('id');

        const body = await req.json();

        await connectMongoDB();

      

        let updateFields = {};

        // Add a new option
        if (body.addOption) {
            const updatedMenu = await Menu.findOneAndUpdate(
                { id: menuId },
                { $push: { options: body.addOption } },
                { new: true, runValidators: true, omitUndefined: true }
            );

            if (!updatedMenu) {
                return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
            }

            return NextResponse.json({ message: 'Option added', menu: updatedMenu }, { status: 200 });
        }

        // Delete an existing option
        if (body.deleteOptionId) {
            const updatedMenu = await Menu.findOneAndUpdate(
                { id: menuId },
                { $pull: { options: { id: body.deleteOptionId } } },
                { new: true, runValidators: true, omitUndefined: true }
            );

            if (!updatedMenu) {
                return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
            }

            return NextResponse.json({ message: 'Option deleted', menu: updatedMenu }, { status: 200 });
        }

        // Update an existing option
        if (body.updateOption) {
            const menu = await Menu.findOne({ id: menuId });
            if (!menu) {
                return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
            }

            const optionIndex = menu.options.findIndex(opt => opt.id === body.updateOption.id);
            if (optionIndex !== -1) {
                menu.options[optionIndex] = { ...menu.options[optionIndex], ...body.updateOption };
                updateFields = { options: menu.options };
            } else {
                return NextResponse.json({ message: 'Option not found' }, { status: 404 });
            }
        }

        if (body.categoryName !== undefined) updateFields.categoryName = body.categoryName;
        if (body.displayName !== undefined) updateFields.displayName = body.displayName;

        const updatedMenu = await Menu.findOneAndUpdate(
            { id: menuId },
            { $set: updateFields },
            { new: true, runValidators: true, omitUndefined: true }
        );

        if (!updatedMenu) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Menu updated', menu: updatedMenu }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error updating menu', error }, { status: 500 });
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
        
        const { searchParams } = new URL(req.url);
        const menuId = searchParams.get('id');

        await connectMongoDB();

        try {
            const decodedToken = verifyToken(req); // If token is invalid, it will throw an error
            console.log("Token verified. User ID:", decodedToken.userId);  // Example use of decoded token
        } catch (error) {
            return NextResponse.json({ message: 'Unauthorized', error: error.message }, { status: 401 });
        }

        const deletedMenu = await Menu.findOneAndDelete({ id: menuId });

        if (!deletedMenu) {
            return NextResponse.json({ message: 'Menu not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Menu deleted', menu: deletedMenu }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error deleting menu', error }, { status: 500 });
    }
}



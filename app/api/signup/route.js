import connectMongoDB from '@/app/libs/mongodb';
import User from '@/app/models/users';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function GET(req) {
    try {
        await connectMongoDB();

        // Get all users
        const users = await User.find({});
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body;
        console.log("this is signup",body);
        await connectMongoDB();

        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error during signup:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const body = await req.json();
        const { name, email, role } = body;

        if (!userId) {
            return NextResponse.json({ message: 'User ID required' }, { status: 400 });
        }

        await connectMongoDB();

        const user = await User.findById(userId).exec();
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.name = name;
        user.email = email;
        user.role = role;
        await user.save();

        return NextResponse.json({ message: 'User updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ message: 'User ID required' }, { status: 400 });
        }

        await connectMongoDB();

        const user = await User.findByIdAndDelete(userId).exec();
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

import bcrypt from 'bcrypt';
import User from '@/app/models/users';
import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/libs/mongodb';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        await connectMongoDB();

        // Check if the user exists
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        // Compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        // If login is successful
        return NextResponse.json({ message: 'Login successful', user: { name: user.name, email: user.email } }, { status: 200 });
        
    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

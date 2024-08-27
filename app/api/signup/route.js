import bcrypt from 'bcrypt';
import User from '@/app/models/users';
import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/libs/mongodb';

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("this is signup body",body);
        const { name, email, password, role } = body.formData;

        await connectMongoDB();

        // Check if the user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("this is hashedPassword",hashedPassword);

        // Create the new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
        
    } catch (error) {
        console.error('Error during signup:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

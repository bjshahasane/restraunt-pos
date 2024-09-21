import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Add this import
import User from '@/app/models/users';
import { NextResponse } from 'next/server';
import connectMongoDB from '@/app/libs/mongodb';

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your .env file

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, role } = body.formData;

        await connectMongoDB();

        // Check if the user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({ message: 'User registered successfully', token }, { status: 201 });

    } catch (error) {
        console.error('Error during signup:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}

import connectMongoDB from '@/app/libs/mongodb';
import User from '@/app/models/users';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectMongoDB();

        // Check if there's any user with the role "superadmin"
        const superadminExists = await User.exists({ role: 'superadmin' });

        return NextResponse.json({ exists: !!superadminExists }, { status: 200 });
    } catch (error) {
        console.error('Error checking for superadmin:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

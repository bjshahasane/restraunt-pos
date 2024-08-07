import User from "@/app/models/users";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectMongoDB from "@/app/libs/mongodb";


export async function POST(req) {
    try {
        const body = await req.json();
        const { formData } = body;
        console.log(formData);

        await connectMongoDB();
        // check for duplicates
        const duplicate = await User.findOne(({ email: formData.email })).lean().exec();
        if (duplicate) {
            return NextResponse.json({ message: "Duplicate Email" }, { status: 400 })
        }

        const hashpassword = await bcrypt.hash(formData.password, 10);
        formData.password = hashpassword;

        await User.create(formData);
        return NextResponse.json({ message: 'User Created' }, { status: 200 });
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: 'error', error}, { status: 500 })
    }
}
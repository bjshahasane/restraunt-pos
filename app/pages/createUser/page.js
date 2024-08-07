import React from "react";
// import { getServerSession } from "next-auth";
// import { options } from "../api/auth/[...nextauth]/options";
import UserForm from "@/app/components/UserForm";
import 'bootstrap/dist/css/bootstrap.css';
import '../../globals.css';

const Member = async () => {
    // const session = await getServerSession(options);
    return (
        <div className="m-3">
            <h1 className="text-center">Create user</h1>
            {/* <p>{session?.user?.name}</p>
            <p>{session?.user?.role}</p> */}
            <UserForm />
        </div>
    )
}

export default Member;
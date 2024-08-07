"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";


const UserForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        const temp = {...formData};
        temp[name] = value;
        setFormData(temp);
      
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({formData}),
            "content-type": "application/json"
        });

        if (!res.ok) {
            const response = await res.json();
            setErrorMessage(response.message)
        } else {
            router.refresh();
            router.push("/");
        }
    }

    return (
        <>
            {/* <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-3 w-1/2">
                <h1>Create New User</h1>
                <label>Full Name</label>
                <input type="text" id="name" name="name" onChange={handleChange} value={formData.name}
                    className="m2 bg-slate-400 rounded"
                    required />

                <label>Email</label>
                <input type="email" id="email" name="email" onChange={handleChange} value={formData.email}
                    className="m2 bg-slate-400 rounded"
                    required />

                <label>Password</label>
                <input type="password" id="password" name="password" onChange={handleChange} value={formData.password}
                    className="m2 bg-slate-400 rounded"
                    required />

                <input type="submit" value="Create User" className="bg-blue-300 hover:bg-blue-100" />
            </form> */}
            <div className="d-flex justify-content-center align-items-center border-0 p-4 rounded detail-box row col-md-4 m-auto mt-5">
                <form onSubmit={handleSubmit} method="post">
                    <div className="form-group m-3" >
                        <label htmlFor="name">Full Name</label>
                        <input type="text" className="form-control" id="name" name="name" onChange={handleChange} value={formData.name} placeholder="Enter username" />
                    </div>
                    <div className="form-group m-3" onSubmit={handleSubmit} method="post">
                        <label htmlFor="email">Email address</label>
                        <input type="email" className="form-control" id="email" name="email" onChange={handleChange} value={formData.email} placeholder="Enter email" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group m-3">
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" id="password" name="password" onChange={handleChange} value={formData.password} placeholder="Password" />
                    </div>

                    <button type="submit" className="btn add-btn m-3">Submit</button>
                </form>
            </div>



            <p>{errorMessage}</p>
        </>
    )
}

export default UserForm;
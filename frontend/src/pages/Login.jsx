import { useState } from "react"

export default function Login(){

    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")

    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })

    return(
        <div className="flex justify-evenly items-center w-full">
            <div className="flex-grow-[3] max-w-4x1 m-4 hidden md:block">
                <table className="table w-full"> 
                <thead>
                    <th>no yet implemented</th>
                    <th>no yet implemented</th>
                    <th>no yet implemented</th>
                    <th>no yet implemented</th>
                </thead>
                <tbody>
                    <tr>
                        <td>not yet implemented</td>
                        <td>not yet implemented</td>
                        <td>not yet implemented</td>
                        <td>not yet implemented</td>
                    </tr>
                    <tr>
                        <td>not yet implemented</td>
                        <td>not yet implemented</td>
                        <td>not yet implemented</td>
                        <td>not yet implemented</td>
                    </tr>
                    <tr>
                        <td>not yet implemented </td>
                        <td>not yet implemented </td>
                        <td>not yet implemented </td>
                        <td>not yet implemented </td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className="divider divider-horizontal h-screen mx-0 hidden md:flex"></div>
            <form className="flex-grow m-4 max-w-lg">
                <h2 className="text-4x1 text-center mb-8">Weather APP</h2>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email:</span>
                    </label>
                    <input
                    type="email"
                    placeholder="example@server.com"
                    className="input input-bordered w-full"
                    value={formData.email}
                    onChange={(e) => { 
                        setFormData((existing) => {
                        return { ...existing, email: e.target.value}
                        })
                    }}
                    />
                    <label className="label">
                        <span className="label-text-alt">Validation Text</span>
                        <span className="label-text-alt">{formData.email}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input 
                        type="password" 
                        placeholder="password"
                        className="input input-bordered w-full"
                        value={formData.password}
                        onChange={(e) => { 
                            setFormData((existing) => {
                                return { ...existing, password: e.target.value}
                            })
                        }}
                    />
                    <label className="label">
                        <span className="label-text-alt">Validation Text</span>
                        <span className="label-text-alt">{formData.password}</span>
                    </label>
                </div>
                <div>
                    <button className="btn btn-primary mr-4">Login</button>
                    <button className="btn btn-secondary">Sign up</button>
                    <label className="label">
                        <span className="label-text-alt">validation text</span>
                    </label>
                </div>
            </form>
        </div>
    )
}
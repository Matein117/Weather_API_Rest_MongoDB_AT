import { useEffect, useState } from "react"
import { getAllTests } from "../api/test.js"
export default function TestCRUD(){
// Load Test list


// this creates a place to store the Test list
const [ tests, setTests ] = useState([]) 
// this will fetch the animal list from the backend 
// when the component loads 
useEffect(() => {
    // get the list of animals from the backend 
    // and store it in state by sung setTests()
    getAllTests()
        .then(tests => {
            setTests(tests)
        })
}, [])


    return (
        <div className="container max-auto grid grid-cols-2 gap-2">
            <div className="overFlow-x-auto">
                <table className="table table-compact w-full"> 
                    <thead>
                        <th>ID</th>
                        <th>Country</th>
                        <th>City</th>
                        <th>select</th>
                    </thead>
                    <tbody>
                        {tests.map(test => <tr>
                            <td>{test.id}</td>
                            <td>{test.country}</td>
                            <td>{test.city}</td>
                            <button
                                className="btn btn-xs mt-1"
                            >Select</button>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
import { useState } from "react"

function App(){

  // return (
  //   <div>
  //     <Calculator></Calculator>
  //   </div>
  // )

  // return (
  //   <div>
  //     <Counter></Counter>
  //   </div>
  // )


  return (
    <LoginPage></LoginPage>
  )


  // return (
  //   <div>
  //     <h1 className="text-red-500 text-lg">Hello world!</h1>
  //     <button className="btn btn-secondary">Button</button>
  //     <Post title="test 1" >
  //       content test  1
  //       <a href="#">link test 1</a>
  //       <a href="#">Comment test 1</a>
  //     </Post>
  //     <Post title="test 2" >
  //       content test  2
  //       <a href="#">link test 2</a>
  //       <a href="#">Comment test 2</a>
  //     </Post>
  //     <Post title="test 3" >
  //       content test  3
  //       <a href="#">link test 3</a>
  //       <a href="#">Comment test 3</a>
  //     </Post>
  //     <Post title="test 4" >
  //       content test  4
  //       <a href="#">link test 4</a>
  //       <a href="#">Comment test 4</a>
  //     </Post>
  //     <Post title="test 5" >
  //       content test  5
  //       <a href="#">link test 5</a>
  //       <a href="#">Comment test 5</a>
  //     </Post>
  //   </div>
  // )
}

function Calculator() {
  const [leftNumber, setLeftNumber] = useState(0)
  const [rightNumber, setRightNumber] = useState(0)
  const [result, setResult] = useState(0)
  return (
    <div className="mt-8">
      <input 
        type="number" 
        className="input input-bordered" 
        value={leftNumber}
        onChange={(e) => {setLeftNumber(parseFloat(e.target.value)) }}
      />
      <input 
        type="number" 
        className="input input-bordered"
        value={rightNumber}
        onChange={(e) => {setRightNumber(parseFloat(e.target.value) )}}
      />
      <div>

        {/* add */}
        <button 
          className="btn"
          onClick={() => {setResult ((leftNumber + rightNumber) )}}
        >Add</button>

        {/* Subtract */}
        <button 
          className="btn"
          onClick={() => {setResult ((leftNumber - rightNumber))}}
        >Subtract</button>

        {/* Multiplication */}
        <button 
          className="btn"
          onClick={() => {setResult ((leftNumber * rightNumber))}}
        >Multiplication</button>

        {/* Division */}
        <button 
          className="btn"
          onClick={() => {setResult ((leftNumber / rightNumber))}}
        >Division</button>
        
      </div>
      <span className="text-4x1">Result:{result}</span>
    </div>
  )
}

function Counter(){

  const [count, setCount] = useState(0)

  return (
    <div>
      <span className="text-xl m-4" style={{"font-size": count + "px"}}>{count}</span>
      <button
        className="btn"
        onClick={() => {setCount(count + 10) }}
      >Count!</button>
    </div>
  )
}

function LoginPage(){

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

function Post({title, children}) {
  return (

  <article>
    <h2>{title}</h2>
    <p>{children}</p>
  </article>
  
  )
}

export default App
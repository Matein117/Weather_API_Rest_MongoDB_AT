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



function Post({title, children}) {
  return (

  <article>
    <h2>{title}</h2>
    <p>{children}</p>
  </article>
  
  )
}

export default App
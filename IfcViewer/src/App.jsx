import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles.css'
import Viewer from './viewer.tsx';


function App() {
  //const [count, setCount] = useState(0)
//const ref = useRef(null);
  return (
    <>
      <div>
        <h2>I am a heading</h2>
        <Viewer/>
      </div>
    </>
  )
}

// function App() {
//   const inputElement = useRef();
  
//   const focusInput = () => {
//     inputElement.current.focus();
//   };

//   return (
//     <>
//     <input type='text' ref={inputElement} />
//     <button onClick={focusInput}>Focus Input</button>
//     </>
//   )
// }


export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Weather from "./Weather";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-300">
      <Weather />
    </div>
    </>
  )
}

export default App

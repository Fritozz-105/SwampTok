import { useState } from 'react'
import reactLogo from '/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-4">
      <div className="flex space-x-4 mb-8">
        <a href="https://vite.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-transform hover:scale-110">
          <img src={reactLogo} className="h-16 w-16 animate-spin-slow" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
        Vite + React + Tailwind
      </h1>

      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-lg p-6 max-w-md w-full mb-8">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mb-4"
        >
          Count is {count}
        </button>

        <p className="text-black mb-4">
          Edit <code className="bg-slate-800 px-1 py-0.5 rounded text-yellow-400">src/App.tsx</code> and save to test HMR
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">{i + 1}</span>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          {['sm', 'md', 'lg'].map((size) => (
            <span key={size} className="px-2 py-1 bg-emerald-600 text-emerald-50 text-xs rounded-full">
              {size}
            </span>
          ))}
        </div>
      </div>

      <p className="text-slate-400 text-sm md:text-base hover:text-white transition-colors">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App

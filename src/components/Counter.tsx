import { useState } from 'preact/hooks'

const Counter = ({ children }) => {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="grid grid-cols-3 text-lg place-items-center max-w-5xl mx-auto mt-16">
        <button
          class="bg-slate-400 px-2"
          onClick={() => setCount((i) => i - 1)}
        >
          -
        </button>
        <h3 class="text-center">{count}</h3>
        <button
          class="bg-slate-400 px-2"
          onClick={() => setCount((i) => i + 1)}
        >
          +
        </button>
      </div>
      <div class="text-center">{children}</div>
    </>
  )
}

export default Counter

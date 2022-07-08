import { Component } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { JSXInternal } from 'preact/src/jsx'

type Color = 'green' | 'yellow' | 'slate'

interface Character {
  char: string
  color: Color
}

const Wordle = () => {
  const [colors, setColors] = useState<Map<string, Color>>(new Map())
  const [words, setWords] = useState<string[]>([])
  const [answer, setAnswer] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<Character[][]>([])
  const [win, setWin] = useState<boolean>(false)
  const handleSubmit = (guess: string) => {
    if (!words.includes(guess)) return
    const letters = {}
    for (const c of answer) letters[c] = (letters[c] || 0) + 1
    let correct = 0
    let newGuess: Character[] = guess.split('').map((char, i) => {
      if (answer[i] === char) {
        letters[char]--
        correct++
        return { char, color: 'green' }
      } else return { char, color: 'slate' }
    })
    newGuess = newGuess.map(({ char, color }) => {
      if (color === 'slate' && letters[char] > 0) {
        letters[char]--
        return { char, color: 'yellow' }
      } else return { char, color }
    })
    setGuesses((guesses) => [...guesses, newGuess])
    setGuess('')
    setColors((colors) => {
      for (const { char, color } of newGuess)
        if (colors.get(char) !== 'green') colors.set(char, color)
      return colors
    })
    if (correct === 5) setWin(true)
  }
  const handleKeyup = ({ key }: { key: string }) => {
    if (win) return
    key = key.toLocaleUpperCase()
    switch (key) {
      case 'ENTER':
        if (guess.length === 5) handleSubmit(guess)
        break
      case 'BACKSPACE':
        if (guess.length > 0) setGuess((guess) => guess.slice(0, -1))
        break
      default:
        if (key.match(/^[A-Z]$/) && guess.length < 5)
          setGuess((guess) => guess + key)
    }
  }
  const handleRestart = () => {
    setAnswer(words.at(Math.floor(Math.random() * words.length)))
    setGuesses([])
    setWin(false)
  }
  const handleForfeit = () => handleSubmit(answer)

  useEffect(() => {
    fetch('wordbank.txt')
      .then((res) => res.text())
      .then((text) => {
        const words = text.split(' ')
        const answer = words.at(Math.floor(Math.random() * words.length))
        setWords(words)
        setAnswer(answer)
      })
      .catch((err) => {
        console.error(err)
        setError(true)
      })
  }, [])
  useEffect(() => {
    document.addEventListener('keyup', handleKeyup)
    return () => document.removeEventListener('keyup', handleKeyup)
  }, [handleKeyup])

  if (error)
    return (
      <h3 class="text-xl text-red-600 text-center">Failed to fetch word</h3>
    )

  if (!answer)
    return <h3 class="text-xl text-center">Fetching a random word...</h3>
  return (
    <div class="flex flex-col items-center gap-2">
      {guesses.map((guess) => (
        <div class="flex gap-2">
          {guess.map((c) => (
            <div
              class={`h-12 w-12 bg-${c.color}-500 text-center leading-[3rem] text-xl font-semibold`}
            >
              {c.char}
            </div>
          ))}
        </div>
      ))}
      {win ? (
        <button
          class="h-12 w-[17rem] bg-slate-500 hover:bg-slate-600 transition-colors duration-100"
          onClick={handleRestart}
        >
          Restart
        </button>
      ) : (
        <>
          <div class="flex gap-2">
            {[...Array(5)].map((c, i) => (
              <div
                class={`h-12 w-12 bg-slate-500 text-center leading-[3rem] text-xl font-semibold`}
              >
                {guess[i] || ' '}
              </div>
            ))}
          </div>
          <button
            class="h-12 w-[17rem] bg-slate-500 hover:bg-slate-600 transition-colors duration-100"
            onClick={handleForfeit}
          >
            Answer
          </button>
        </>
      )}
      <div class="flex gap-1 absolute bottom-16 mx-12 flex-wrap justify-center">
        {[...Array(26)].map((_, i) => {
          const char = String.fromCharCode(65 + i)
          const color = colors.get(char)
          return (
            <button
              class={`h-10 w-10 ${
                color && `bg-${color}-500`
              } text-center leading-10 text-xl`}
              onClick={() => handleKeyup({ key: char })}
            >
              {char}
            </button>
          )
        })}
        <button
          class="h-10 w-10 bg-slate-500 text-center leading-10 text-xl"
          onClick={() => handleKeyup({ key: 'ENTER' })}
        >
          ⏎
        </button>
        <button
          class="h-10 w-10 bg-slate-500 text-center leading-10 text-lg"
          onClick={() => handleKeyup({ key: 'BACKSPACE' })}
        >
          ⌫
        </button>
      </div>
    </div>
  )
}

export default Wordle

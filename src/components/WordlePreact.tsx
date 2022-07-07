import { useEffect, useState } from 'preact/hooks'
import { JSXInternal } from 'preact/src/jsx'

type Color = 'green' | 'yellow' | 'gray'

interface Character {
  char: string
  color: Color
}

const Wordle = () => {
  const [words, setWords] = useState<string[]>([])
  const [answer, setAnswer] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<Character[][]>([])
  const [win, setWin] = useState<boolean>(false)
  const submitHandler = () => {
    if (!words.includes(guess)) return
    const letters = {}
    for (const c of answer) letters[c] = (letters[c] || 0) + 1
    let correct = 0
    let newGuess: Character[] = guess.split('').map((char, i) => {
      if (answer[i] === char) {
        letters[char]--
        correct++
        return { char, color: 'green' }
      } else return { char, color: 'gray' }
    })
    newGuess = newGuess.map(({ char, color }) => {
      if (color === 'gray' && letters[char] > 0) {
        letters[char]--
        return { char, color: 'yellow' }
      } else return { char, color }
    })
    setGuesses((guesses) => [...guesses, newGuess])
    setGuess('')
    if (correct === 5) setWin(true)
  }
  const keyupHandler: JSXInternal.KeyboardEventHandler<Window> = ({ key }) => {
    if (win) return
    key = key.toLocaleUpperCase()
    switch (key) {
      case 'ENTER':
        if (guess.length === 5) submitHandler()
        break
      case 'BACKSPACE':
        if (guess.length > 0) setGuess((guess) => guess.slice(0, -1))
        break
      default:
        if (key.match(/^[A-Z]$/) && guess.length < 5)
          setGuess((guess) => guess + key)
    }
  }
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
    document.addEventListener('keyup', keyupHandler)
    return () => document.removeEventListener('keyup', keyupHandler)
  })

  if (error) return <h3 class="text-xl text-red-600">Failed to fetch word</h3>
  if (!answer) return <h3 class="text-xl">Fetching a random word...</h3>
  return (
    <div class="flex flex-col items-center gap-2">
      {(win
        ? guesses
        : [
            ...guesses,
            [...Array(5)].map((_, i) => ({
              char: guess[i] || ' ',
              color: 'gray',
            })),
          ]
      ).map((guess) => (
        <div class="flex gap-2">
          {guess.map((c) => (
            <div
              class={`h-12 w-12 bg-${c.color}-400 text-center leading-[3rem] text-xl font-semibold`}
            >
              {c.char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Wordle

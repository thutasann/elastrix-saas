import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateObjectId() {
  const hexDigits = '0123456789abcdef'

  function generateRandomHex(length: number) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += hexDigits.charAt(Math.floor(Math.random() * hexDigits.length))
    }
    return result
  }

  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')
  const machineIdentifier = generateRandomHex(6) // 3 bytes
  const processIdentifier = generateRandomHex(4) // 2 bytes
  const counter = generateRandomHex(6) // 3 bytes

  return timestamp + machineIdentifier + processIdentifier + counter
}

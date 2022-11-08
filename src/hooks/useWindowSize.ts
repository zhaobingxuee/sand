import { useEffect, useState } from 'react'

interface WindowSize {
  windowWidth: number
  windowHeight: number
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    windowWidth: 0,
    windowHeight: 0,
  })

  useEffect(() => {
    const handler = () => {
      setWindowSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      })
    }

    handler()

    window.addEventListener('resize', handler)

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return windowSize
}

export default useWindowSize
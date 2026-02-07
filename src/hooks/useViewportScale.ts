import { useState, useEffect, useCallback } from 'react'

const DESIGN_WIDTH = 1100
const MOBILE_BREAKPOINT = 768

export function useViewportScale() {
  const getScale = useCallback(() => {
    const vw = window.innerWidth
    if (vw >= DESIGN_WIDTH || vw < MOBILE_BREAKPOINT) {
      return { zoom: 1, isScaled: false }
    }
    return { zoom: vw / DESIGN_WIDTH, isScaled: true }
  }, [])

  const [state, setState] = useState(getScale)

  useEffect(() => {
    const handleResize = () => setState(getScale())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [getScale])

  return state
}

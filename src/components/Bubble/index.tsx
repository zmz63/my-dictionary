import { memo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { animated, to, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import Search from '@/icons/Search'
import './index.scss'

function Bubble() {
  const navigate = useNavigate()

  const boundaryRef = useRef<HTMLDivElement>(null)

  const [{ x, y }, animate] = useSpring(
    () => JSON.parse(localStorage.getItem('BUBBLE_POSITION') || 'null') || { x: 0, y: 0 }
  )

  const bind = useDrag(
    state => {
      const { down, offset, last } = state
      let offsetX = offset[0]
      if (last) {
        const [[left, right]] = state._bounds
        if (left === -Infinity || left === Infinity) return
        if (offsetX < (left + right) / 2) {
          offsetX = left
        } else {
          offsetX = right
        }
        localStorage.setItem('BUBBLE_POSITION', JSON.stringify({ x: offsetX, y: offset[1] }))
      }
      animate.start({ x: offsetX, y: offset[1], immediate: down })
    },
    {
      pointer: {
        touch: true
      },
      filterTaps: true,
      bounds: boundaryRef,
      from: () => [x.get(), y.get()]
    }
  )

  return (
    <div className="bubble">
      <div className="bubble-boundary-wrapper">
        <div className="bubble-boundary" ref={boundaryRef}></div>
      </div>
      <animated.div
        {...bind()}
        className="bubble-button"
        onClick={() => navigate('/search')}
        style={{
          transform: to([x, y], (x, y) => `translate(${x}px, ${y}px)`),
          touchAction: 'none'
        }}
      >
        <Search />
      </animated.div>
    </div>
  )
}

export default memo(Bubble)

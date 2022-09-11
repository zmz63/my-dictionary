import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMemoizedFn } from 'ahooks'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { Button, Mask, SpinLoading } from 'antd-mobile'
import useWordbook from '@/hooks/useWordbook'
import Card from '@/components/Card'
import Bubble from '@/components/Bubble'
import type { Filter, Sortord } from '@/hooks/useWordbook'
import type { Word } from '@/typings/word'
import './index.scss'

function Cards() {
  const navigate = useNavigate()

  const { id: clientId } = useParams()

  const location = useLocation()

  const {
    index = 0,
    sortord,
    filter
  } = (location.state as {
    index: number
    sortord: Sortord
    filter: Filter
  }) || {}

  const [loading, wordbook, words] = useWordbook(clientId || '', sortord, filter)

  const [targetList, setTargetList] = useState<
    {
      index: number
      data: Word
    }[]
  >([])

  useEffect(() => {
    if (!loading && !wordbook) {
      navigate('/')
    }
  }, [loading, wordbook, navigate])

  const [translationVisible, setTranslationVisible] = useState(true)
  const [autoPlay, setAutoPlay] = useState(false)

  const currentIndex = useRef(index)
  const offsetLeft = useRef(0)

  const [{ x }, animate] = useSpring(() => ({
    x: -currentIndex.current * window.innerWidth,
    config: { tension: 300 }
  }))

  const calculateRange = useMemoizedFn(() => {
    const start = Math.max(0, currentIndex.current - 1)
    const end = Math.min(words.length, currentIndex.current + 2)

    offsetLeft.current = start * window.innerWidth

    setTargetList(
      words.slice(start, end).map((item, index) => ({
        data: item,
        index: index + start
      }))
    )
  })

  useEffect(() => {
    calculateRange()
  }, [words, calculateRange])

  const bind = useDrag(
    state => {
      const { down, offset, last, swipe } = state
      let offsetX = offset[0]
      if (last) {
        let index = 0
        if (swipe[0] === 1) {
          index = -Math.ceil(offsetX / window.innerWidth)
        } else if (swipe[0] === -1) {
          index = -Math.floor(offsetX / window.innerWidth)
        } else {
          const delta = currentIndex.current * window.innerWidth + offsetX
          if (delta > 0) {
            index = -Math.ceil(offsetX / window.innerWidth)
          } else {
            index = -Math.floor(offsetX / window.innerWidth)
          }
        }
        offsetX = -index * window.innerWidth
        if (currentIndex.current !== index) {
          if (autoPlay) {
            const audio = document.createElement('audio')
            audio.setAttribute(
              'src',
              `https://dict.youdao.com/dictvoice?audio=${words[index].word}&type=${2}`
            )
            audio.play()
          }
          currentIndex.current = index
          calculateRange()
        }
      }
      animate.start({ x: offsetX, immediate: down })
    },
    {
      axis: 'x',
      pointer: {
        touch: true
      },
      rubberband: true,
      bounds: {
        left: -(words.length - 1) * window.innerWidth,
        right: 0
      },
      from: () => [x.get(), 0]
    }
  )

  return loading ? (
    <Mask className="mask-container" opacity={0}>
      <SpinLoading color="primary" />
    </Mask>
  ) : (
    <>
      <Bubble />
      <div className="cards">
        <animated.div
          {...bind()}
          style={{
            translateX: x.to(x => `${x}px`),
            touchAction: 'none'
          }}
        >
          <div
            className="cards-container"
            style={{
              marginLeft: `${offsetLeft.current}px`,
              width: `${words.length * window.innerWidth - offsetLeft.current}px`
            }}
          >
            {targetList.map(item => (
              <Card key={item.index} visible={translationVisible} wordData={item.data} />
            ))}
          </div>
        </animated.div>
        <div className="buttons-wrapper">
          <Button onClick={() => setTranslationVisible(!translationVisible)} shape="rounded">
            {`${translationVisible ? '隐藏' : '显示'}释义`}
          </Button>
          <Button onClick={() => setAutoPlay(!autoPlay)} shape="rounded">
            {`${autoPlay ? '关闭' : '自动'}发音`}
          </Button>
        </div>
      </div>
    </>
  )
}

export default Cards

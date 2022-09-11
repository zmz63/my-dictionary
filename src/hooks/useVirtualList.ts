import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { useEventListener, useMemoizedFn, useSize } from 'ahooks'

type Options = {
  containerTarget: MutableRefObject<Element | null>
  wrapperTarget: MutableRefObject<Element | null>
  height: number
}

function useVirtualList<T>(
  list: T[],
  { containerTarget, wrapperTarget, height }: Options
): [
  {
    index: number
    data: T
  }[],
  number,
  number
] {
  const size = useSize(containerTarget)

  const startRef = useRef(0)
  const endRef = useRef(0)

  const [targetList, setTargetList] = useState<
    {
      index: number
      data: T
    }[]
  >([])

  const calculateRange = useMemoizedFn((forced?: boolean) => {
    const container = containerTarget.current
    const wrapper = wrapperTarget.current

    if (container && wrapper) {
      const { scrollTop, clientHeight } = container

      const offset = Math.ceil(scrollTop / height)
      const visibleCount = Math.ceil(clientHeight / height)

      const overscan = 5

      const start = Math.max(0, Math.floor(offset / overscan - 1) * overscan)
      const end = Math.min(list.length, start + visibleCount + 2 * overscan)

      if (start === startRef.current && end === endRef.current && !forced) {
        return
      } else {
        startRef.current = start
        endRef.current = end
      }

      setTargetList(
        list.slice(start, end).map((item, index) => ({
          data: item,
          index: index + start
        }))
      )
    }
  })

  useEffect(() => {
    if (!size?.width || !size?.height) {
      return
    }
    calculateRange(true)
  }, [size?.width, size?.height, list, calculateRange])

  useEventListener(
    'scroll',
    (event: Event) => {
      event.preventDefault()
      calculateRange()
    },
    {
      target: containerTarget
    }
  )

  return [targetList, startRef.current, endRef.current]
}

export default useVirtualList

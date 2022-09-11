import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorageState } from 'ahooks'
import { animated, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { Checkbox, Dialog, Input } from 'antd-mobile'
import { useAppSelector } from '@/store'
import { handleUpdateWordbook } from '@/utils/wordbook'
import Cover from '@/components/Cover'
import Search from '@/icons/Search'
import './index.scss'

const headerHeight = 80

function Home() {
  const navigate = useNavigate()

  const wordbookMap = useAppSelector(state => state.wordbook.wordbooks)

  const [defaultWordbook, setDefaultWordbook] = useLocalStorageState<number>('DEFAULT_WORDBOOK', {
    deserializer: Number
  })

  const newName = useRef('')
  const checked = useRef(false)

  const contentRef = useRef<HTMLDivElement>(null)

  const wordbooks = Object.values(wordbookMap)
  const fillerList = []

  const [selectedItem, setSelectedItem] = useState<number>(-1)
  const [editing, setEditing] = useState(false)

  const [rowLength, setRowLength] = useState(Math.floor(window.innerWidth / 110))
  const fillerCount =
    Math.ceil((wordbooks.length + 1) / rowLength) * rowLength - wordbooks.length - (editing ? 0 : 1)

  for (let i = 0; i < fillerCount; i++) {
    fillerList.push(<Cover key={`filler${i}`} type="filler" />)
  }

  useEffect(() => {
    const handleResize = () => {
      setRowLength(Math.floor(window.innerWidth / 110))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [{ y }, animate] = useSpring(() => ({
    y: 0,
    config: { tension: 300 }
  }))

  const bind = useDrag(
    state => {
      const content = contentRef.current
      if (!content || content.scrollTop !== 0) return
      const { offset, last } = state
      let offsetY = offset[1]
      if (last) {
        const [, [top, bottom]] = state._bounds
        if (offsetY < (top + bottom) / 2) {
          content.style.overflow = 'auto'
          offsetY = top
        } else {
          content.style.overflow = 'hidden'
          content.scrollTop = 0
          offsetY = bottom
        }
      }
      animate.start({
        y: offsetY
      })
    },
    {
      axis: 'y',
      pointer: {
        touch: true
      },
      bounds: {
        bottom: 0,
        top: -headerHeight
      },
      from: () => [0, y.get()]
    }
  )

  return (
    <>
      <Dialog
        actions={[
          [
            {
              key: 'cancel',
              text: '取消'
            },
            {
              key: 'confirm',
              text: '确定'
            }
          ]
        ]}
        closeOnAction
        closeOnMaskClick
        content={
          <>
            <Input
              autoFocus
              className="home-input-box"
              clearable
              defaultValue={wordbookMap[selectedItem]?.name}
              onChange={value => (newName.current = value)}
              placeholder="重命名"
            />
            <Checkbox
              className="home-check-box"
              defaultChecked={wordbookMap[selectedItem]?.clientId === defaultWordbook}
              disabled={wordbookMap[selectedItem]?.clientId === defaultWordbook}
              onChange={value => (checked.current = value)}
              style={{
                '--icon-size': '18px',
                '--font-size': '14px',
                '--gap': '6px'
              }}
            >
              设置为默认单词本
            </Checkbox>
          </>
        }
        destroyOnClose
        onAction={action => {
          if (action.key === 'confirm') {
            const item = wordbookMap[selectedItem]
            if (checked.current === true) {
              setDefaultWordbook(item.clientId)
            }
            if (newName.current !== item.name) {
              const { clientId, createdAt } = item
              handleUpdateWordbook({ clientId, name: newName.current, createdAt })
            }
          }
        }}
        onClose={() => setSelectedItem(-1)}
        title="修改单词本"
        visible={selectedItem > -1}
      />
      <div className="home">
        <div className="home-header">
          <div className="search-box button" onClick={() => navigate('/search')}>
            <div>
              <span>请输入要搜索的单词</span>
            </div>
            <Search />
          </div>
        </div>
        <animated.div
          {...bind()}
          className="home-panel"
          style={{
            translateY: y.to(y => `${y}px`),
            touchAction: 'none'
          }}
        >
          <div className="panel-header">
            <div className="title">单词本</div>
            <div className="action-bar">
              <span className="button" onClick={() => setEditing(!editing)}>
                {`${editing ? '完成' : '编辑'}`}
              </span>
            </div>
          </div>
          <div className="cover-wrapper" ref={contentRef}>
            {!editing && (
              <Cover key="new" onClick={() => !editing && navigate('/create')} type="new" />
            )}
            {[
              ...wordbooks.map((item, index) => (
                <Cover
                  clientId={item.clientId}
                  count={item.count}
                  editing={editing}
                  isDefault={item.clientId === defaultWordbook}
                  key={index}
                  name={item.name}
                  onClick={() => {
                    if (!editing) {
                      navigate(`/wordbook/${item.clientId}`)
                    } else {
                      setSelectedItem(item.clientId)
                      checked.current = item.clientId === defaultWordbook
                      newName.current = item.name
                    }
                  }}
                />
              )),
              ...fillerList
            ]}
          </div>
        </animated.div>
      </div>
    </>
  )
}

export default Home

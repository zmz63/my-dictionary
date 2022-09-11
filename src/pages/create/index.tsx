import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Checkbox, Input, Toast } from 'antd-mobile'
import { handleAddWordbook } from '@/utils/wordbook'
import './index.scss'

function Create() {
  const navigate = useNavigate()

  const name = useRef('')
  const checked = useRef(false)

  const [length, setLength] = useState(0)

  const handleChange = (value: string) => {
    const length = value.length
    name.current = value
    setLength(length)
  }

  const handleClick = () => {
    handleAddWordbook(name.current, checked.current, true)
      .then(() => {
        Toast.show({
          content: '创建成功',
          position: 'top'
        })

        navigate(-1)
      })
      .catch(() => {
        Toast.show({
          content: '该单词本已存在',
          position: 'top'
        })
      })
  }

  return (
    <div className="create-container">
      <div className="title">新建单词本</div>
      <Input
        autoFocus
        className="input-box"
        clearable
        onChange={handleChange}
        placeholder="名称不得多于20字"
      />
      <div className="length">{`${length}/20`}</div>
      <Checkbox
        className="check-box"
        disabled={!length}
        onChange={value => (checked.current = value)}
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px'
        }}
      >
        设置为默认单词本
      </Checkbox>
      <Button block color="primary" disabled={!length} onClick={handleClick} size="large">
        创建
      </Button>
    </div>
  )
}

export default Create

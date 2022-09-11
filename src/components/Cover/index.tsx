import { memo } from 'react'
import type { MouseEventHandler } from 'react'
import { Toast } from 'antd-mobile'
import { handleDeleteWordbook } from '@/utils/wordbook'
import Add from '@/icons/Add'
import Close from '@/icons/Close'
import './index.scss'

export type CoverProps = {
  type?: 'new' | 'filler' | 'default'
  name?: string
  count?: number
  clientId?: number
  isDefault?: boolean
  editing?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
}

function Cover({
  type = 'default',
  name,
  count,
  clientId,
  isDefault,
  editing,
  onClick
}: CoverProps) {
  return (
    <div className="cover-container" onClick={onClick}>
      {(type === 'new' && (
        <div className="cover-new button">
          <Add />
          <span className="text">新建</span>
        </div>
      )) ||
        (type === 'default' && (
          <div className="cover-default button">
            <div className="figures">
              <div className="figure"></div>
              <div className="figure"></div>
              <div className="figure"></div>
            </div>
            {editing && (
              <div
                className="close"
                onClick={event => {
                  event.stopPropagation()
                  if (isDefault) {
                    Toast.show({
                      content: '默认单词本不能删除哦',
                      position: 'top'
                    })
                    return
                  }
                  if (clientId) {
                    handleDeleteWordbook(clientId)
                  }
                }}
              >
                <Close />
              </div>
            )}
            {isDefault && (
              <div className="tag">
                <span>默认</span>
              </div>
            )}
            <div className="name">{name}</div>
            <div className="count">{count || 0}词</div>
          </div>
        ))}
    </div>
  )
}

export default memo(Cover)

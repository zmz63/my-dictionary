import { memo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleUpdateWord } from '@/utils/wordbook'
import type { Word } from '@/typings/word'
import Phonogram from '@/components/Phonogram'
import Tag from '@/icons/Tag'
import Right from '@/icons/Right'
import './index.scss'

export type CardProps = {
  wordData: Word
  visible: boolean
}

function Card({ wordData, visible }: CardProps) {
  const navigate = useNavigate()

  const { word, ukPhonogram, usPhonogram, translations, sentence, state } = wordData

  const [translationVisible, setTranslationVisible] = useState(visible)

  useEffect(() => {
    setTranslationVisible(visible)
  }, [visible])

  const markWord = (mark: boolean) => {
    const data = { ...wordData, state: mark ? 1 : 0 }
    handleUpdateWord([data], false, `${mark ? '' : '取消'}标记`)
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className={`mark button${state ? ' active' : ''}`} onClick={() => markWord(!state)}>
          <Tag />
        </div>
        <div className="title">{word}</div>
        {(ukPhonogram || usPhonogram) && (
          <div className="card-phonogram">
            {ukPhonogram && <Phonogram phonogram={ukPhonogram} type={1} word={word} />}
            {usPhonogram && <Phonogram phonogram={usPhonogram} type={2} word={word} />}
          </div>
        )}
      </div>
      <div className="card-line"></div>
      <div className="card-body">
        <div className="body-container">
          {translations && (
            <div
              className="translation-container button"
              onClick={() => setTranslationVisible(!translationVisible)}
            >
              {!translationVisible && <span className="notice">点击显示释义</span>}
              <ul
                className="translation-list"
                style={{ visibility: translationVisible ? 'visible' : 'hidden' }}
              >
                {translations.map((item, index) => (
                  <li className="translation-item" key={index}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sentence && (
            <div className="sentence-container">
              <div className="title">例句</div>
              <div>
                <div className="sentence" dangerouslySetInnerHTML={{ __html: sentence.sentence }} />
                {translationVisible ? (
                  <div className="translation">{sentence.translation}</div>
                ) : (
                  <div className="line"></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="card-footer">
        <div className="button" onClick={() => navigate(`/result?keyword=${word}`)}>
          <span>详细释义</span>
          <Right className="arrow" />
        </div>
      </div>
    </div>
  )
}

export default memo(Card)

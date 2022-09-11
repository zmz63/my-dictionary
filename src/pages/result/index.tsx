import { Fragment, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Button, Dialog, Divider, Skeleton, Toast } from 'antd-mobile'
import { reqGetSearchResult } from '@/api'
import { handleAddWord } from '@/utils/wordbook'
import Phonogram from '@/components/Phonogram'
import Add from '@/icons/Add'
import './index.scss'

function Result() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const keyword = searchParams.get('keyword') || ''

  const { data, loading, run } = useRequest(reqGetSearchResult, {
    manual: true,
    debounceWait: 300
  })

  useEffect(() => {
    if (keyword === '') {
      navigate(-1)
      return
    }
    run(keyword)
  }, [keyword, navigate, run])

  const {
    usPhonogram,
    ukPhonogram,
    translations,
    words,
    examType,
    wordforms,
    sentences,
    synonyms,
    phrases,
    language
  } = data || {}

  const addWord = () => {
    if (!data) return

    const clientId = Number(localStorage.getItem('DEFAULT_WORDBOOK'))

    if (isNaN(clientId)) {
      Dialog.confirm({
        content: '你还没有创建过单词本\n是否立即创建?',
        onConfirm() {
          navigate('/create')
        }
      })
      return
    }

    const { word, usPhonogram, ukPhonogram, translations, sentences } = data

    const translation = translations.join('')
    const brief = translation.length > 26 ? `${translation.slice(0, 26)}...` : translation

    const wordData = [
      {
        clientId,
        word,
        brief,
        usPhonogram: usPhonogram || '',
        ukPhonogram: ukPhonogram || '',
        translations,
        sentence: sentences[0] || {
          sentence: '',
          origin: '',
          translation: '',
          source: ''
        },
        state: 0,
        createdAt: Date.now()
      }
    ]

    handleAddWord(wordData, true)
      .then(() => {
        Toast.show({
          content: '添加成功',
          position: 'top'
        })
      })
      .catch(() => {
        Toast.show({
          content: '该单词已存在',
          position: 'top'
        })
      })
  }

  const order: ('paraphrase' | 'sentences' | 'phrases' | 'synonyms')[] = [
    'paraphrase',
    'sentences',
    'synonyms',
    'phrases'
  ]

  const elements = {
    paraphrase:
      (translations && translations.length > 0 && (
        <div className="result-paraphrase">
          <div className="title">释义</div>
          <ul className="translation-list">
            {translations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {examType && examType.length > 0 && (
            <ul className="exam-list">
              {examType.map((item, index) => (
                <Fragment key={index}>
                  {index !== 0 && <li>\</li>}
                  <li>{item}</li>
                </Fragment>
              ))}
            </ul>
          )}
          {wordforms && wordforms.length > 0 && (
            <ul className="word-form-list">
              {wordforms.map((item, index) => (
                <li key={index}>
                  <div className="wordform">{item.wordform}</div>
                  <div
                    className="word button"
                    onClick={() => navigate(`/result?keyword=${item.value}`)}
                  >
                    {item.value}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )) ||
      (words && words.length > 0 && (
        <div className="result-paraphrase">
          <div className="title">释义</div>
          <ul className="word-list">
            {words.map((item, index) => (
              <li key={index}>
                <div
                  className="text button link"
                  onClick={() => navigate(`/result?keyword=${item.text}`)}
                >
                  {item.text}
                </div>
                <div className="translation">{item.translation}</div>
              </li>
            ))}
          </ul>
        </div>
      )),
    sentences: sentences && sentences.length > 0 && (
      <div className="result-sentences">
        <div className="title">例句</div>
        <ul className="sentence-list">
          {sentences.map((item, index) => (
            <li key={index}>
              <div className="sentence" dangerouslySetInnerHTML={{ __html: item.sentence }} />
              <div className="translation">{item.translation}</div>
              <div className="source">{item.source || '来源于网络'}</div>
            </li>
          ))}
        </ul>
      </div>
    ),
    synonyms: synonyms && synonyms.length > 0 && (
      <div className="result-synonyms">
        <div className="title">同义词</div>
        <ul className="synonym-list">
          {synonyms.map((item, index) => (
            <li key={index}>
              {item.pos && <div className="pos">{item.pos}</div>}
              <div className="synonyms-wrapper">
                <div className="translation">{item.translation}</div>
                <ul className="word-list">
                  {item.words.map((word, index) => (
                    <Fragment key={index}>
                      {index !== 0 && <li>\</li>}
                      <li
                        className="button link"
                        onClick={() => navigate(`/result?keyword=${word}`)}
                      >
                        {word}
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ),
    phrases: phrases && phrases.length > 0 && (
      <div className="result-phrases">
        <div className="title">短语</div>
        <ul className="phrase-list">
          {phrases.map((item, index) => (
            <li key={index}>
              <div
                className="phrase button link"
                onClick={() => navigate(`/result?keyword=${item.phrase}`)}
              >
                {item.phrase}
              </div>
              <div className="translation">{item.translation}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <div className="keyword">{keyword}</div>
      </div>
      {loading ? (
        <>
          <Skeleton.Title animated />
          <Skeleton.Paragraph animated lineCount={8} />
        </>
      ) : (
        <>
          {(ukPhonogram || usPhonogram) && (
            <div className="result-phonogram">
              {ukPhonogram && (
                <Phonogram phonogram={ukPhonogram} type={1} word={keyword.toLowerCase()} />
              )}
              {usPhonogram && (
                <Phonogram phonogram={usPhonogram} type={2} word={keyword.toLowerCase()} />
              )}
            </div>
          )}
          {order.map((key, index) => (
            <Fragment key={key}>
              {index !== 0 && elements[key] && <Divider />}
              {elements[key]}
            </Fragment>
          ))}
        </>
      )}
      {data && language === 'eng' && (
        <Button className="fixed" color="primary" onClick={() => addWord()} shape="rounded">
          <Add />
          <span>加入单词本</span>
        </Button>
      )}
    </div>
  )
}

export default Result

import { useState, useEffect, useCallback } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import { slides, Slide, SlideContent } from './slides'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(index)
        setIsTransitioning(false)
      }, 150)
    }
  }, [isTransitioning])

  const next = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide])
  const prev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev])

  useEffect(() => {
    Prism.highlightAll()
  }, [currentSlide])

  const slide = slides[currentSlide]

  return (
    <div className="slideshow">
      <div className="slide">
        <div className={`slide-wrapper ${isTransitioning ? 'transitioning' : ''}`} key={currentSlide}>
          <SlideRenderer slide={slide} />
        </div>
      </div>

      <div className="controls">
        <button onClick={prev} disabled={currentSlide === 0} className="nav-btn">
          <span>←</span>
        </button>

        <div className="progress">
          <div className="progress-text">
            {currentSlide + 1} / {slides.length}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>

        <button onClick={next} disabled={currentSlide === slides.length - 1} className="nav-btn">
          <span>→</span>
        </button>
      </div>

      <div className="slide-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(i)}
          />
        ))}
      </div>
    </div>
  )
}

function SlideRenderer({ slide }: { slide: Slide }) {
  return (
    <div className={`slide-content slide-type-${slide.type}`}>
      <header className="slide-header">
        <h1>{slide.title}</h1>
        {slide.subtitle && <p className="subtitle">{slide.subtitle}</p>}
      </header>
      <div className="slide-body">
        <ContentRenderer content={slide.content} />
      </div>
    </div>
  )
}

function ContentRenderer({ content }: { content: SlideContent }) {
  switch (content.kind) {
    case 'title':
      return (
        <div className="title-content">
          <p className="tagline">{content.tagline}</p>
        </div>
      )

    case 'numbered':
      return (
        <ol className="numbered-list">
          {content.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      )

    case 'bullets':
      return (
        <ul className="bullet-list">
          {content.items.map((item, i) => (
            <li key={i}>
              <strong>{item.text}</strong>
              {item.detail && <span className="detail"> - {item.detail}</span>}
            </li>
          ))}
        </ul>
      )

    case 'code':
      return (
        <div className="code-block">
          <pre><code className={`language-${content.language}`}>{content.code}</code></pre>
          {content.caption && <p className="caption">{content.caption}</p>}
        </div>
      )

    case 'table':
      return (
        <table className="data-table">
          <thead>
            <tr>
              {content.headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      )

    case 'diagram':
      return (
        <div className="diagram">
          <pre className="ascii">{content.ascii}</pre>
          {content.caption && <p className="caption">{content.caption}</p>}
        </div>
      )

    case 'split':
      return (
        <div className="split-content">
          <div className="split-left">
            {content.left.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="bold">{line.slice(2, -2)}</p>
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="list-item">{line}</p>
              }
              return <p key={i}>{line}</p>
            })}
          </div>
          <div className="split-right">
            <pre><code className={`language-${content.right.language}`}>{content.right.code}</code></pre>
          </div>
        </div>
      )

    default:
      return null
  }
}

export default App
